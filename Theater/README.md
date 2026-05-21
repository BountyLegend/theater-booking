# Theatre Booking App

Αυτή η εφαρμογή φτιάχτηκε για εργασία κρατήσεων θέσεων σε θεατρικές παραστάσεις.  
Ο χρήστης μπορεί να κάνει εγγραφή/σύνδεση, να δει διαθέσιμες παραστάσεις, να επιλέξει ώρα και θέση, να κάνει κράτηση και να διαχειριστεί τις κρατήσεις του.

Το project αποτελείται από:

- React Native / Expo frontend
- Node.js / Express backend
- SQLite βάση δεδομένων για τοπική εκτέλεση
- JWT authentication με access token και refresh token

## Βασικές λειτουργίες

Η εφαρμογή υποστηρίζει:

- Εγγραφή και σύνδεση χρήστη
- Αποθήκευση token στη συσκευή
- Access token και refresh token
- Αυτόματη ανανέωση access token όταν λήγει
- Προβολή θεάτρων και θεατρικών παραστάσεων
- Αναζήτηση με βάση τίτλο παράστασης, θέατρο ή τοποθεσία
- Φίλτρα κατηγοριών, όπως Drama, Musical, Comedy, Opera, Ballet κλπ.
- Προβολή λεπτομερειών παράστασης
- Επιλογή showtime
- Θεατρικό seat map με διαθέσιμες, επιλεγμένες και κρατημένες θέσεις
- Δημιουργία κράτησης
- Προβολή ιστορικού κρατήσεων χρήστη
- Ακύρωση κράτησης
- Αλλαγή θέσης μέσω cancel-and-rebook flow
- Αποδέσμευση θέσης μετά την ακύρωση

## Τεχνολογίες

### Frontend

- React Native
- Expo
- TypeScript
- Zustand για auth state
- Axios για API requests
- Expo Secure Store για αποθήκευση tokens σε mobile συσκευές

### Backend

- Node.js
- Express
- TypeScript
- TypeORM
- SQLite
- bcrypt για hashing password
- jsonwebtoken για JWT access/refresh tokens

## Δομή project

```text
theater-booking/
├── client/          # React Native / Expo εφαρμογή
├── server/          # Node.js / Express backend
└── README.md
```

## Οδηγίες εγκατάστασης

Για να τρέξει το project τοπικά, ακολουθούμε τα παρακάτω βήματα.

### 1. Προαπαιτούμενα

Χρειάζονται εγκατεστημένα:

- Node.js
- npm
- Git
- Expo Go στο κινητό, αν γίνει δοκιμή σε πραγματική συσκευή
- Ένας code editor, π.χ. VS Code

### 2. Κατέβασμα project

Αν το project βρίσκεται σε GitHub:

```bash
git clone <repository-url>
cd theater-booking
```

Αν το project δοθεί ως zip, κάνουμε extract τον φάκελο και ανοίγουμε terminal μέσα στον φάκελο:

```bash
cd theater-booking
```

### 3. Εγκατάσταση backend

Από τον root φάκελο του project:

```bash
cd server
npm install
```

### 4. Εγκατάσταση frontend

Ανοίγουμε δεύτερο terminal ή επιστρέφουμε στον αρχικό φάκελο και τρέχουμε:

```bash
cd client
npm install
```

Αν βρισκόμαστε ήδη μέσα στο server, τότε:

```bash
cd ../client
npm install
```

### 5. Ρύθμιση backend

Το backend τρέχει από προεπιλογή στο port 3000.

Στον φάκελο server μπορεί να δημιουργηθεί αρχείο `.env`.

Παράδειγμα `.env`:

```env
PORT=3000
JWT_SECRET=dev_access_secret
ACCESS_TOKEN_SECRET=dev_access_secret
REFRESH_TOKEN_SECRET=dev_refresh_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
```

Για τοπικό demo, αν δεν υπάρχει `.env`, το backend χρησιμοποιεί development defaults.

### 6. Δημιουργία / reset βάσης δεδομένων

Η εφαρμογή χρησιμοποιεί SQLite για τοπική εκτέλεση.

Για να δημιουργηθεί ή να γίνει reset η βάση με demo δεδομένα:

```bash
cd server
npx ts-node seed.ts
```

Το seed δημιουργεί demo δεδομένα για θέατρα, θεατρικές παραστάσεις, showtimes και θέσεις.

### 7. Εκκίνηση backend

```bash
cd server
npm run dev
```

Αν όλα πάνε σωστά, το backend τρέχει στο:

```text
http://localhost:3000
```

### 8. Εκκίνηση frontend

Σε δεύτερο terminal:

```bash
cd client
npx expo start -c
```

Για web εκτέλεση:

```bash
npx expo start --web
```

ή:

```bash
npm run web
```

Για κινητό:

1. Ανοίγουμε το Expo Go.
2. Σκανάρουμε το QR code που εμφανίζεται στο terminal.
3. Η εφαρμογή ανοίγει στη συσκευή.

### 9. Σημείωση για mobile / Expo Go

Στο web, το frontend χρησιμοποιεί:

```text
http://localhost:3000/api
```

Σε πραγματικό κινητό, το localhost δείχνει το ίδιο το κινητό και όχι τον υπολογιστή που τρέχει το backend.

Γι' αυτό στο αρχείο:

```text
client/src/config/api.ts
```

υπάρχει μια τοπική IP, για παράδειγμα:

```ts
const LOCAL_IP = "192.168.1.131";
```

Αν το project τρέξει σε άλλο δίκτυο ή σε άλλον υπολογιστή, πρέπει να αλλαχτεί αυτή η IP με την IPv4 του υπολογιστή που τρέχει το backend.

### 10. Βασική δοκιμή λειτουργίας

Αφού τρέχουν backend και frontend, μπορεί να δοκιμαστεί το παρακάτω flow:

1. Register ή Login.
2. Προβολή λίστας θεατρικών παραστάσεων.
3. Αναζήτηση με τίτλο, θέατρο ή τοποθεσία.
4. Φιλτράρισμα με κατηγορίες.
5. Άνοιγμα λεπτομερειών παράστασης.
6. Επιλογή showtime.
7. Επιλογή θέσης από το seat map.
8. Κράτηση θέσης.
9. Η θέση εμφανίζεται ως reserved.
10. Προβολή κράτησης στο My Reservations / Bookings.
11. Ακύρωση κράτησης.
12. Η θέση γίνεται ξανά διαθέσιμη.
13. Logout.

## Authentication

Η εφαρμογή χρησιμοποιεί JWT authentication.

Μετά το login/register, το backend εκδίδει:

- access token
- refresh token
- user data

Το access token χρησιμοποιείται στα protected API requests με:

```text
Authorization: Bearer <accessToken>
```

Αν το access token λήξει, ο client καλεί αυτόματα το `/refresh` endpoint με το refresh token και παίρνει νέο access token. Έτσι ο χρήστης δεν χρειάζεται να κάνει ξανά login κάθε φορά που λήγει το access token.

Στο mobile τα tokens αποθηκεύονται με `expo-secure-store`.

Στο web demo αποθηκεύονται με `localStorage`.

## Κύρια API endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

Υπάρχουν και aliases:

- `POST /api/login`
- `POST /api/refresh`
- `POST /api/logout`

### Θέατρα / Παραστάσεις

- `GET /api/theatres`
- `GET /api/shows`
- `GET /api/shows/:id`

### Θέσεις

- `GET /api/seats?showtimeId=...`

### Κρατήσεις

- `POST /api/reservations`
- `PUT /api/reservations/:id`
- `DELETE /api/reservations/:id`
- `GET /api/user/reservations`

## Βάση δεδομένων

Για τοπική εκτέλεση χρησιμοποιείται SQLite.

Η βάση είναι relational και περιλαμβάνει βασικές οντότητες όπως:

- Users
- Theatres
- Shows
- Showtimes
- Seats
- Reservations

Η λογική μπορεί να μεταφερθεί σε MariaDB με αλλαγή στο TypeORM configuration.

## Σημειώσεις

- Το project είναι theatre booking app.
- Τα demo δεδομένα περιλαμβάνουν θεατρικές παραστάσεις, musicals, τραγωδίες, όπερα, μπαλέτο και κωμωδίες.
- Για σταθερή λειτουργία σε Expo Go χρησιμοποιείται stack navigation.
- Η αλλαγή θέσης γίνεται με cancel-and-rebook flow.
- Για την εργασία χρησιμοποιήθηκε SQLite αντί για MariaDB ώστε το project να τρέχει εύκολα τοπικά.
- Η πλήρης ενσωμάτωση OIDC/PKCE με πάροχο όπως Keycloak μπορεί να προστεθεί ως μελλοντική επέκταση.
