# IoT Web Server

A personal playground for databases, real-time IoT data ingestion, and browser-based dashboards.

---

## Current Features

### Database schema
| Table | Purpose |
|-------|---------|
| `light_data`      | Raw sensor readings |
| `light_state`     | Latest red / yellow / green status |
| `users`           | Registered accounts (bcrypt-hashed passwords) |
| `frequency`       | Last frequency level sent by clients |

### Front-end
* Live graph of light sensor data  
* “Generate Sine Wave” demo button  
* Three state-change buttons (toggled by ESP devices)  
* User registration & login with session cookies  
* Frequency sender UI  
* Mini-apps:  
  * Rock • Paper • Scissors  
  * Binary vending-machine simulator  (Demo for FPGA-board project)
  * Etch-a-Sketch clone  
* Animated “typewriter” greeting for the logged-in user

### Server
* Node.js + Express, served on port 80  
* MySQL 8 backend (config via `DATABASE_URL`)  
* Reverse-proxied behind Cloudflare DNS  
* REST endpoints to receive sensor/state/frequency data and update the UI

---

## Quick Start

```bash
git clone https://github.com/Loff-code/iot-web-server.git
cd iot-web-server
cp .env.example .env    # Change .env to fit with your database
mysql -u <user> -p < schema.sql   # Create the schema in your DB
npm install
npm start

