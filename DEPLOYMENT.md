# Barot Mobility — Deployment Guide (લાઈવ ડિપ્લોયમેન્ટ ગાઈડ)

આ સોફ્ટવેરને ઇન્ટરનેટ પર લાઈવ ડિપ્લોય કરવાની ૩ શ્રેષ્ઠ અને સૌથી સરળ રીતો નીચે મુજબ છે:

---

## 🚀 વિકલ્પ ૧: Render.com (સૌથી સરળ & ૧૦૦% મફત)
Render.com પર આ પ્રોજેક્ટ ૧ ક્લિકમાં ફ્રીમાં લાઈવ થઈ શકે છે.

### પગલાં:
1. **GitHub પર અપલોડ કરો:**
   - તમારા GitHub એકાઉન્ટમાં નવું private/public repository બનાવો (દા.ત. `barot-mobility`).
   - આ ફોલ્ડરમાંથી કમાન્ડ ચલાવો:
     ```bash
     git remote add origin https://github.com/<તમારું_યુઝરનેમ>/barot-mobility.git
     git branch -M main
     git push -u origin main
     ```
2. **Render.com પર જાઓ:**
   - [https://render.com](https://render.com) પર લોગીન કરો.
   - **New +** બટન પર ક્લિક કરી **Web Service** પસંદ કરો.
   - તમારું GitHub Repository કનેક્ટ કરો.
3. **સેટિંગ્સ ભરો:**
   - **Name:** `barot-mobility`
   - **Environment:** `Node`
   - **Build Command:**
     ```bash
     npm install --prefix server && npm install --prefix client && npm run build --prefix client
     ```
   - **Start Command:**
     ```bash
     node server/server.js
     ```
4. **Deploy Web Service** પર ક્લિક કરો. ૨ મિનિટમાં તમને લાઈવ લિંક (જેમ કે `https://barot-mobility.onrender.com`) મળી જશે, જે હર્ષ ભાઈ પોતાના મોબાઈલમાં પણ ખોલી શકશે!

---

## 🐳 વિકલ્પ ૨: Docker & Docker-Compose (કોઈપણ VPS જેમ કે DigitalOcean, AWS, Linode)
પ્રોજેક્ટમાં [`Dockerfile`](file:///mnt/c/Users/Om%20Prajapati/Desktop/Harsh%20Barot/Dockerfile) અને [`docker-compose.yml`](file:///mnt/c/Users/Om%20Prajapati/Desktop/Harsh%20Barot/docker-compose.yml) પહેલેથી જ ગોઠવેલા છે.

```bash
docker compose up -d --build
```
આ કમાન્ડથી આખો પ્રોજેક્ટ સર્વર પર બેકગ્રાઉન્ડમાં લાઈવ થઈ જશે અને ડેટા સેવ રહેશે.

---

## 💻 વિકલ્પ ૩: પોતાના લેપટોપ / ઓફિસ પીસી પર લોકલ નેટવર્કમાં ચલાવવું (Wi-Fi Access)
જો હર્ષ ભાઈ કલોલ ઓફિસના Wi-Fi પરથી પોતાના ફોનમાં પણ આ સોફ્ટવેર વાપરવા માંગતા હોય:
1. તમારા લેપટોપનું લોકલ IP શોધો (દા.ત. `ip a` અથવા `ipconfig` -> `192.168.1.XX`).
2. મોબાઈલના બ્રાઉઝરમાં ખોલો: `http://192.168.1.XX:5000`.
