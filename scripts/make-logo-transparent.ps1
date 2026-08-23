param(
  [Parameter(Mandatory = $true)]
  [string]$InputPath,

  [Parameter(Mandatory = $true)]
  [string]$OutputPath
)

Add-Type -AssemblyName System.Drawing

$source = [System.Drawing.Bitmap]::FromFile($InputPath)
$canvas = New-Object System.Drawing.Bitmap($source.Width, $source.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$graphics = [System.Drawing.Graphics]::FromImage($canvas)
$graphics.DrawImageUnscaled($source, 0, 0)
$graphics.Dispose()
$source.Dispose()

# The supplied artwork is a dark-green mark composited on white. Reconstruct
# edge alpha against the dominant green so anti-aliased contours do not retain
# a white fringe. Neutral, very light pixels are treated as background.
$referenceRed = 13.0
$referenceGreen = 55.0
$referenceBlue = 32.0
$left = $canvas.Width
$top = $canvas.Height
$right = -1
$bottom = -1

for ($y = 0; $y -lt $canvas.Height; $y++) {
  for ($x = 0; $x -lt $canvas.Width; $x++) {
    $pixel = $canvas.GetPixel($x, $y)
    $maximum = [Math]::Max($pixel.R, [Math]::Max($pixel.G, $pixel.B))
    $minimum = [Math]::Min($pixel.R, [Math]::Min($pixel.G, $pixel.B))
    $chroma = $maximum - $minimum

    $alphaRed = (255.0 - $pixel.R) / (255.0 - $referenceRed)
    $alphaGreen = (255.0 - $pixel.G) / (255.0 - $referenceGreen)
    $alphaBlue = (255.0 - $pixel.B) / (255.0 - $referenceBlue)
    $alpha = [Math]::Max($alphaRed, [Math]::Max($alphaGreen, $alphaBlue))
    $alpha = [Math]::Max(0.0, [Math]::Min(1.0, $alpha))

    if ($maximum -ge 220 -and $chroma -le 2) {
      $alpha = 0.0
    }
    elseif ($alpha -lt 0.018) {
      $alpha = 0.0
    }

    $alphaByte = [int][Math]::Round($alpha * 255.0)
    if ($alphaByte -eq 0) {
      $canvas.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
      continue
    }

    if ($alphaByte -lt 250) {
      # Use the sampled brand green for translucent edge pixels. Reconstructing
      # RGB from extremely small alpha values amplifies invisible source noise.
      $red = [int]$referenceRed
      $green = [int]$referenceGreen
      $blue = [int]$referenceBlue
    }
    else {
      $red = $pixel.R
      $green = $pixel.G
      $blue = $pixel.B
    }

    # The supplied mark is monochrome green. Remove isolated non-green pixels
    # from the source export without flattening its intended tonal variation.
    if ($green -lt $red -or $green -lt $blue) {
      $red = [int]$referenceRed
      $green = [int]$referenceGreen
      $blue = [int]$referenceBlue
    }

    $canvas.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alphaByte, $red, $green, $blue))

    if ($alphaByte -gt 8) {
      if ($x -lt $left) { $left = $x }
      if ($x -gt $right) { $right = $x }
      if ($y -lt $top) { $top = $y }
      if ($y -gt $bottom) { $bottom = $y }
    }
  }
}

if ($right -lt $left -or $bottom -lt $top) {
  $canvas.Dispose()
  throw "No visible logo pixels were found."
}

$padding = 12
$cropLeft = [Math]::Max(0, $left - $padding)
$cropTop = [Math]::Max(0, $top - $padding)
$cropRight = [Math]::Min($canvas.Width - 1, $right + $padding)
$cropBottom = [Math]::Min($canvas.Height - 1, $bottom + $padding)
$cropWidth = $cropRight - $cropLeft + 1
$cropHeight = $cropBottom - $cropTop + 1

$output = New-Object System.Drawing.Bitmap($cropWidth, $cropHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$outputGraphics = [System.Drawing.Graphics]::FromImage($output)
$outputGraphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
$sourceRectangle = New-Object System.Drawing.Rectangle($cropLeft, $cropTop, $cropWidth, $cropHeight)
$destinationRectangle = New-Object System.Drawing.Rectangle(0, 0, $cropWidth, $cropHeight)
$outputGraphics.DrawImage($canvas, $destinationRectangle, $sourceRectangle, [System.Drawing.GraphicsUnit]::Pixel)
$outputGraphics.Dispose()
$canvas.Dispose()

$outputDirectory = Split-Path -Parent $OutputPath
if ($outputDirectory -and -not (Test-Path -LiteralPath $outputDirectory)) {
  New-Item -ItemType Directory -Path $outputDirectory | Out-Null
}
$output.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$output.Dispose()

Write-Output "Created transparent logo: $OutputPath ($cropWidth x $cropHeight)"
