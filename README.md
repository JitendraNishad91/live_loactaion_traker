# Live Location Tracker

Real-time GPS location tracker with live map, WebSocket updates, and admin dashboard. Track target locations in real-time on an interactive map with a modern dark UI.

## Features
- **Real-time tracking** via WebSocket (Socket.IO)
- **Live interactive map** with Leaflet
- **Admin dashboard** with stats and target management
- **Battery & speed monitoring**
- **Cloudflare Tunnel** for instant public URL
- **Deploy ready** for Render, Railway, Fly.io, etc.

## Prerequisites
- **Node.js** (v16 or higher)

## Installation

1. **Clone the repository**
```bash
git clone https://github.com/JitendraNishad91/live_loactaion_traker.git
cd live_loactaion_traker
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the application**
```bash
npm start
```

4. **Login credentials**
```
Username: admin
Password: admin
```

## How it works

1. Open the admin panel at `http://localhost:6589`
2. Login with the credentials above
3. Copy the target URL (shown in the dashboard) and send it to the target person
4. When the target opens the link, their browser asks for location permission
5. Once allowed, their location appears on your dashboard in real-time

## Deploy on Render

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Build command: `npm install`
5. Start command: `node .`
6. Deploy

## Environment Variables
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 6589) |
| `HOST` | Public URL (set automatically on Render/Railway) |

## Developed by
[JitendraNishad91](https://github.com/JitendraNishad91)
