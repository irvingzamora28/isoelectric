import { promises as fs } from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

const SITE_METADATA_PATH = path.join(process.cwd(), 'data', 'siteMetadata.js')
const IMAGES_DIR = path.join(process.cwd(), 'public', 'static', 'images')
const FAVICON_DIR = path.join(process.cwd(), 'public', 'static', 'favicons')

// Helper to update siteMetadata.js with new logo URL
async function updateSiteLogo(logoUrl: string) {
  let content = await fs.readFile(SITE_METADATA_PATH, 'utf8')
  // Replace the siteLogo line
  content = content.replace(/siteLogo: .*,/, `siteLogo: '${logoUrl}',`)
  await fs.writeFile(SITE_METADATA_PATH, content, 'utf8')
}

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('logo') as File | null

  if (file) {
    // Save file to /public/static/images
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const ext = path.extname(file.name) || '.png'
    const fileName = `logo-uploaded${ext}`
    const filePath = path.join(IMAGES_DIR, fileName)
    await fs.writeFile(filePath, buffer)
    const logoUrl = `/static/images/${fileName}`

    // Generate favicons using sharp
    try {
      // 16x16
      await sharp(buffer).resize(16, 16).png().toFile(path.join(FAVICON_DIR, 'favicon16.png'))
      // 32x32
      await sharp(buffer).resize(32, 32).png().toFile(path.join(FAVICON_DIR, 'favicon32.png'))
      // 76x76 (Apple touch icon)
      await sharp(buffer).resize(76, 76).png().toFile(path.join(FAVICON_DIR, 'apple76.png'))
    } catch (err) {
      return NextResponse.json(
        { success: false, error: 'Sharp image processing failed', details: String(err) },
        { status: 500 }
      )
    }

    await updateSiteLogo(logoUrl)
    return NextResponse.json({ success: true, logoUrl })
  } else {
    return NextResponse.json({ success: false, error: 'No logo provided' }, { status: 400 })
  }
}
