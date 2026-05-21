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

Η εφαρμογ