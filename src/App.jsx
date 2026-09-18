import { useEffect, useRef, useState } from 'react'
import logoUrl from './assets/logo.png'
import './App.css'

const BLACK = '#262624'
const WHITE = '#FFFFFF'
const GRAY = '#696864'

const IMAGE_WIDTH = 1080
const IMAGE_HEIGHT = 3000

function App() {
  const canvasRef = useRef(null)

  const [roomNumber, setRoomNumber] = useState('1')
  const [imageReady, setImageReady] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    let cancelled = false

    async function updateImage() {
      setImageReady(false)
      setStatus('')

      try {
        const logo = await loadImage(logoUrl)

        if (!cancelled) {
          drawInstructionImage(logo)
          setImageReady(true)
        }
      } catch {
        if (!cancelled) {
          setStatus(
            'The logo could not be loaded. Make sure it is saved as src/assets/logo.png.',
          )
        }
      }
    }

    updateImage()

    return () => {
      cancelled = true
    }
  }, [roomNumber])

  function loadImage(source) {
    return new Promise((resolve, reject) => {
      const image = new Image()

      image.onload = () => resolve(image)
      image.onerror = reject
      image.src = source
    })
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ')
    const lines = []
    let currentLine = ''

    words.forEach((word) => {
      const testLine = currentLine
        ? `${currentLine} ${word}`
        : word

      if (
        ctx.measureText(testLine).width > maxWidth &&
        currentLine
      ) {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    })

    if (currentLine) {
      lines.push(currentLine)
    }

    lines.forEach((line, index) => {
      ctx.fillText(line, x, y + index * lineHeight)
    })

    return y + lines.length * lineHeight
  }

  function drawLogo(
    ctx,
    logo,
    centerY,
    maximumWidth,
    maximumHeight,
  ) {
    const scale = Math.min(
      maximumWidth / logo.naturalWidth,
      maximumHeight / logo.naturalHeight,
    )

    const width = logo.naturalWidth * scale
    const height = logo.naturalHeight * scale
    const x = (IMAGE_WIDTH - width) / 2
    const y = centerY - height / 2

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(logo, x, y, width, height)
  }

  function drawInstructionStep(
    ctx,
    number,
    text,
    startY,
  ) {
    const numberX = 62
    const textX = 212
    const textWidth = 795

    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'

    ctx.fillStyle = WHITE
    ctx.font = '900 78px Arial, Helvetica, sans-serif'
    ctx.fillText(number, numberX, startY)

    ctx.fillStyle = WHITE
    ctx.font = '400 38px Arial, Helvetica, sans-serif'

    const textBottom = wrapText(
      ctx,
      text,
      textX,
      startY + 5,
      textWidth,
      49,
    )

    const contentBottom = Math.max(
      startY + 88,
      textBottom,
    )

    return {
      contentBottom,
      nextY: contentBottom + 48,
    }
  }

  function drawSectionHeading(ctx, text, y) {
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillStyle = BLACK
    ctx.font = '900 51px Arial, Helvetica, sans-serif'
    ctx.fillText(text, IMAGE_WIDTH / 2, y)
  }

  function drawDashedLine(
    ctx,
    startX,
    startY,
    endX,
    endY,
  ) {
    ctx.save()

    ctx.strokeStyle = BLACK
    ctx.lineWidth = 2
    ctx.setLineDash([14, 12])

    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.stroke()

    ctx.restore()
  }

  function drawInstructionImage(logo) {
    const canvas = canvasRef.current

    if (!canvas) return

    canvas.width = IMAGE_WIDTH
    canvas.height = IMAGE_HEIGHT

    const ctx = canvas.getContext('2d')

    /*
      Clean white image background.
    */
    ctx.fillStyle = WHITE
    ctx.fillRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT)

    /*
      Extra white space above the assignment heading.
    */
    drawSectionHeading(
      ctx,
      'YOUR ROOM ASSIGNMENT',
      120,
    )

    /*
      Dashed line below the Room Assignment heading.
    */
    drawDashedLine(
      ctx,
      70,
      205,
      IMAGE_WIDTH - 70,
      205,
    )

    /*
      Room Assignment section with even padding
      above and below its contents.
    */
    const assignmentY = 235
    const assignmentHeight = 270

    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = BLACK
    ctx.font = '900 44px Arial, Helvetica, sans-serif'

    ctx.fillText(
      'ROOM & LOCKBOX # :',
      70,
      assignmentY + assignmentHeight / 2,
    )

    /*
      Mailchimp-inspired muted-black number block.
    */
    const numberBlockX = 700
    const numberBlockY = assignmentY
    const numberBlockWidth = 270
    const numberBlockHeight = 270

    ctx.fillStyle = BLACK
    ctx.fillRect(
      numberBlockX,
      numberBlockY,
      numberBlockWidth,
      numberBlockHeight,
    )

    ctx.fillStyle = WHITE
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = '900 190px Arial, Helvetica, sans-serif'

    ctx.fillText(
      roomNumber,
      numberBlockX + numberBlockWidth / 2,
      numberBlockY + numberBlockHeight / 2,
    )

    /*
      Vertical dashed line between the colon and
      the muted-black room-number block.
    */
    drawDashedLine(
      ctx,
      640,
      assignmentY + 40,
      640,
      assignmentY + assignmentHeight - 40,
    )

    /*
      Matching dashed line below the Room Assignment section.
    */
    drawDashedLine(
      ctx,
      70,
      535,
      IMAGE_WIDTH - 70,
      535,
    )

    /*
      Small instruction moved lower so it appears
      in the phone's collapsed image preview.
    */
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillStyle = GRAY
    ctx.font = '700 21px Arial, Helvetica, sans-serif'

    ctx.fillText(
      'TAP IMAGE TO EXPAND',
      IMAGE_WIDTH / 2,
      855,
    )

    /*
      Crescent Hotel logo positioned below the tap message.
    */
    drawLogo(
      ctx,
      logo,
      1060,
      590,
      340,
    )

    /*
      Access Instructions heading.
    */
    drawSectionHeading(
      ctx,
      'ACCESS INSTRUCTIONS',
      1270,
    )

    /*
      Full-width muted-black instruction section.
    */
    const instructionsY = 1360
    const topPadding = 70
    const maximumInstructionsHeight = 1200

    ctx.fillStyle = BLACK
    ctx.fillRect(
      0,
      instructionsY,
      IMAGE_WIDTH,
      maximumInstructionsHeight,
    )

    let stepY = instructionsY + topPadding
    let stepResult

    stepResult = drawInstructionStep(
      ctx,
      '01',
      'Find the lockboxes beside the hotel’s side entrance, opposite The Crescent Store.',
      stepY,
    )

    stepY = stepResult.nextY

    stepResult = drawInstructionStep(
      ctx,
      '02',
      `Use Lockbox ${roomNumber}.`,
      stepY,
    )

    stepY = stepResult.nextY

    stepResult = drawInstructionStep(
      ctx,
      '03',
      'Enter the last seven digits of your reservation phone number—the XXX-XXXX portion, without the dash. The first digit wakes the lockbox. Do not press another button first.',
      stepY,
    )

    stepY = stepResult.nextY

    stepResult = drawInstructionStep(
      ctx,
      '04',
      'Press the unlock button. If you have trouble, press unlock to clear the lock and start over.',
      stepY,
    )

    stepY = stepResult.nextY

    stepResult = drawInstructionStep(
      ctx,
      '05',
      `Take the key card. It opens the side entrance and Room ${roomNumber}. Guest rooms are upstairs.`,
      stepY,
    )

    /*
      Equal spacing above step 01 and below step 05.
    */
    const instructionsBottom =
      stepResult.contentBottom + topPadding

    const maximumInstructionsBottom =
      instructionsY + maximumInstructionsHeight

    /*
      Remove unused black space below the balanced section.
    */
    ctx.fillStyle = WHITE
    ctx.fillRect(
      0,
      instructionsBottom,
      IMAGE_WIDTH,
      maximumInstructionsBottom - instructionsBottom,
    )

    /*
      Help section.
    */
    const helpY = instructionsBottom + 150

    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillStyle = BLACK
    ctx.font = '900 62px Arial, Helvetica, sans-serif'

    ctx.fillText(
      'NEED HELP?',
      75,
      helpY,
    )

    ctx.font = '900 39px Arial, Helvetica, sans-serif'

    ctx.fillText(
      'During store hours:',
      75,
      helpY + 135,
    )

    ctx.font = '400 37px Arial, Helvetica, sans-serif'

    ctx.fillText(
      'Go inside The Crescent Store.',
      75,
      helpY + 187,
    )

    ctx.font = '900 39px Arial, Helvetica, sans-serif'

    ctx.fillText(
      'After hours:',
      75,
      helpY + 260,
    )

    ctx.font = '400 37px Arial, Helvetica, sans-serif'

    wrapText(
      ctx,
      'Press the button on the Ring camera beside the lockboxes.',
      75,
      helpY + 312,
      895,
      49,
    )

    /*
      Unmonitored-text warning.
    */
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillStyle = GRAY
    ctx.font = '600 21px Arial, Helvetica, sans-serif'

    ctx.fillText(
      'Please do not reply. This number is not monitored for text messages.',
      IMAGE_WIDTH / 2,
      2910,
    )

    /*
      Very thin solid border around the entire image.
    */
    ctx.save()

    ctx.strokeStyle = BLACK
    ctx.lineWidth = 2
    ctx.setLineDash([])

    ctx.strokeRect(
      1,
      1,
      IMAGE_WIDTH - 2,
      IMAGE_HEIGHT - 2,
    )

    ctx.restore()
  }

  function getFileName() {
    return `Crescent-Hotel-Room-${roomNumber}.png`
  }

  function canvasToBlob() {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current

      if (!canvas) {
        reject(new Error('Canvas unavailable'))
        return
      }

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Image could not be created'))
        }
      }, 'image/png')
    })
  }

  async function saveToPhotos() {
    if (!imageReady) return

    setStatus('')

    try {
      const blob = await canvasToBlob()
      const fileName = getFileName()

      const file = new File([blob], fileName, {
        type: 'image/png',
      })

      /*
        On iPhone, Apple requires the person to choose
        Save Image from the Share Sheet.
      */
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        try {
          await navigator.share({
            files: [file],
          })

          setStatus(
            'Choose Save Image to place it in Photos.',
          )

          return
        } catch (error) {
          if (error.name === 'AbortError') return
        }
      }

      /*
        Desktop and unsupported-browser fallback.
      */
      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = objectUrl
      link.download = fileName

      document.body.appendChild(link)
      link.click()
      link.remove()

      setTimeout(() => {
        URL.revokeObjectURL(objectUrl)
      }, 1000)

      setStatus('The PNG image was downloaded.')
    } catch {
      setStatus(
        'The image could not be saved. Please try again.',
      )
    }
  }

  async function openFullImage() {
    if (!imageReady) return

    /*
      Open the tab immediately so Safari knows the new tab
      was requested by the person tapping the button.
    */
    const imageWindow = window.open('', '_blank')

    if (!imageWindow) {
      setStatus(
        'Please allow pop-ups for this page, then try again.',
      )
      return
    }

    imageWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
          />

          <title>Crescent Hotel Room ${roomNumber}</title>

          <style>
            html,
            body {
              margin: 0;
              min-height: 100%;
              background: #ffffff;
            }

            body {
              display: flex;
              justify-content: center;
              align-items: flex-start;
            }

            p {
              padding: 30px;
              font-family: Arial, sans-serif;
              color: #262624;
            }

            img {
              display: block;
              width: 100%;
              max-width: 1080px;
              height: auto;
            }
          </style>
        </head>

        <body>
          <p>Preparing your image…</p>
        </body>
      </html>
    `)

    imageWindow.document.close()

    try {
      const blob = await canvasToBlob()
      const objectUrl = URL.createObjectURL(blob)

      imageWindow.document.body.innerHTML = ''

      const image =
        imageWindow.document.createElement('img')

      image.src = objectUrl
      image.alt =
        `Crescent Hotel access instructions for Room ${roomNumber}`

      imageWindow.document.body.appendChild(image)

      imageWindow.addEventListener(
        'beforeunload',
        () => {
          URL.revokeObjectURL(objectUrl)
        },
        { once: true },
      )
    } catch {
      imageWindow.close()
      setStatus('The full image could not be opened.')
    }
  }

  return (
    <main className="app">
      <header className="app-header">
        <p className="eyebrow">
          Crescent Hotel
        </p>

        <h1>
          Room instruction images
        </h1>

        <p className="intro">
          Choose a room and save its reusable arrival
          instructions to your iPhone Photos.
        </p>
      </header>

      <div className="workspace">
        <section className="controls">
          <div className="field">
            <label htmlFor="room-number">
              Room number
            </label>

            <select
              id="room-number"
              value={roomNumber}
              onChange={(event) => {
                setRoomNumber(event.target.value)
              }}
            >
              {Array.from({ length: 10 }, (_, index) => {
                const room = String(index + 1)

                return (
                  <option value={room} key={room}>
                    Room {room}
                  </option>
                )
              })}
            </select>
          </div>

          <button
            type="button"
            className="primary-button"
            disabled={!imageReady}
            onClick={saveToPhotos}
          >
            SAVE TO PHOTOS
          </button>

          <button
            type="button"
            className="secondary-button"
            disabled={!imageReady}
            onClick={openFullImage}
          >
            OPEN FULL IMAGE
          </button>

          {status && (
            <p className="status" role="status">
              {status}
            </p>
          )}

          <p className="iphone-note">
            On iPhone, tap Save to Photos and choose
            <strong> Save Image</strong>. The same menu can
            also be used to send the image directly through
            Messages.
          </p>
        </section>

        <section className="preview-area">
          <p className="preview-label">
            Room {roomNumber} preview
          </p>

          <div className="preview-frame">
            <canvas ref={canvasRef} />
          </div>
        </section>
      </div>
    </main>
  )
}

export default App