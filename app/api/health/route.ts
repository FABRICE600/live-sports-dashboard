import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Reports whether each provider key is configured (true/false only — never the values).
export function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Live Mutch API is running',
    providers: {
      football: Boolean(process.env.FOOTBALL_API_KEY),
      basketball: Boolean(process.env.BASKETBALL_API_KEY),
      tennis: Boolean(process.env.TENNIS_API_KEY),
      cricket: Boolean(process.env.CRICKET_API_KEY),
    },
  })
}
