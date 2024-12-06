import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // TODO: Replace this URL with your actual HTTPS endpoint
    const UPLOAD_ENDPOINT = 'https://your-api-endpoint.com/upload';

    const uploadFormData = new FormData();
    uploadFormData.append('audio', audioFile);

    const response = await fetch(UPLOAD_ENDPOINT, {
      method: 'POST',
      body: uploadFormData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload to external service');
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
}
