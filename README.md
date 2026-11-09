# ReceptApp

En mobilapplikation byggd med **React Native och Expo** där användare kan registrera sig, logga in och hantera recept.

---

## Innehåll

- [Funktioner](#funktioner)
- [Tekniker](#tekniker)
- [Förutsättningar](#förutsättningar)
- [Installation](#installation)
- [Starta projektet](#starta-projektet)
- [Autentisering och säkerhet](#autentisering-och-säkerhet)
- [API](#api)
- [Databas](#databas)

---

## Funktioner

- Registrera användare och logga in med e-postadress och lösenord.
- Behålla inloggningen mellan appstarter.
- Visa en lista över recept.
- Söka efter recept.
- Visa receptdetaljer, ingredienser och instruktioner.
- Skapa egna recept.
- Redigera och ta bort egna recept.
- Visa recept även utan att vara inloggad.
- Dela recept med mobilens inbyggda delningsfunktion.
- Visa laddningsindikatorer och felmeddelanden.
- Anpassa gränssnittet till olika skärmstorlekar.

## Tekniker

| Område | Teknik |
|---|---|
| Mobilapp | React Native |
| Utvecklingsmiljö | Expo |
| Navigation | React Navigation |
| Backend | Node.js och Express |
| Databas | SQLite |
| Databasanslutning | better-sqlite3 |
| Autentisering | JSON Web Token (JWT) |
| Lösenordshantering | bcryptjs |
| Säker lagring | Expo SecureStore |
| Lokal lagring | AsyncStorage |

---

## Förutsättningar

Innan installationen behöver du ha följande installerat:

- [Node.js](https://nodejs.org/)
- npm (medföljer Node.js)
- [Git](https://git-scm.com/)
- [Expo Go](https://expo.dev/go) på din mobiltelefon

**Viktigt:** Datorn och mobiltelefonen behöver vara anslutna till samma lokala nätverk när appen körs med Expo Go.

---

## Installation

### 1. Klona projektet

Öppna terminalen och kör:

```bash
git clone https://github.com/glagol05/ReceptApp.git
cd ReceptApp
```

### 2. Installera backend

Gå till servermappen:

```bash
cd server
npm install
```

### 3. Konfigurera backend

Skapa en lokal miljöfil:

```bash
cp .env.example .env
```

Öppna `server/.env` och ange en egen JWT-kod:

```env
JWT_SECRET=DIN_EGEN_KOD
```

Du kan generera en kod med följande kommando:

```bash
openssl rand -hex 32
```

Kopiera resultatet till `JWT_SECRET` i `.env`.

### 4. Installera mobilappen

Öppna en ny terminal och gå till klientmappen:

```bash
cd ReceptApp/client
npm install
```

### 5. Konfigurera mobilappen

Skapa en lokal miljöfil:

```bash
cp .env.example .env
```

Öppna `client/.env` och ange datorns lokala IP-adress:

```env
EXPO_PUBLIC_API_URL=http://DIN-DATORS-IP-ADRESS:3000
```

Exempel:

```env
EXPO_PUBLIC_API_URL=http://199.999.0.100:3000
```

Använd din egen dators IP-adress.

## Starta projektet

Projektet består av en backend och en mobilapp. Båda behöver köras samtidigt.

### Terminal 1 – starta backend

Gå till servermappen:

```bash
cd ReceptApp/server
npm start
```

Servern startar på port `3000`.

### Terminal 2 – starta mobilappen

Gå till klientmappen:

```bash
cd ReceptApp/client
npx expo start
```

En QR-kod visas i terminalen.

1. Öppna Expo Go på mobiltelefonen.
2. Skanna QR-koden.
3. Appen startar på telefonen.

---

## Autentisering och säkerhet

- Lösenord hashats innan de sparas i databasen.
- JWT används för autentisering av skyddade API-anrop.
- Inloggningstoken sparas med Expo SecureStore.
- Skapande, redigering och borttagning av recept kräver autentisering.
- Backend kontrollerar att användaren äger receptet innan det får redigeras eller tas bort.

## API

Backend tillhandahåller följande REST API-endpoints:

| HTTP-metod | Endpoint | Beskrivning |
|---|---|---|
| POST | `/api/register` | Registrera användare |
| POST | `/api/login` | Logga in |
| GET | `/api/recipes` | Hämta alla recept |
| GET | `/api/recipes/:id` | Hämta ett specifikt recept |
| POST | `/api/recipes` | Skapa ett recept |
| PATCH | `/api/recipes/:id` | Redigera ett recept |
| DELETE | `/api/recipes/:id` | Ta bort ett recept |

POST-, PATCH- och DELETE-anrop för recept kräver en giltig JWT-token. Användare kan endast ändra och ta bort sina egna recept.

## Databas

Projektet använder SQLite för att lagra användare och recept.

Databasfilen skapas automatiskt när backend startas och sparas lokalt i:

```text
server/database/recipes.db
```