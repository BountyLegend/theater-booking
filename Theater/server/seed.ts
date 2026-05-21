import { AppDataSource } from "./src/data-source";
import { Theater } from "./src/entities/Theater";
import { Show } from "./src/entities/Show";
import { Showtime } from "./src/entities/Showtime";
import { Seat } from "./src/entities/Seat";

const seed = async () => {
    await AppDataSource.initialize();
    await AppDataSource.dropDatabase();
    await AppDataSource.synchronize();

    console.log("Seeding theatre performance data...");

    const theaterRepo = AppDataSource.getRepository(Theater);
    const showRepo = AppDataSource.getRepository(Show);
    const showtimeRepo = AppDataSource.getRepository(Showtime);
    const seatRepo = AppDataSource.getRepository(Seat);

    const theaters = [
        { name: "Apollo Main Stage", location: "Athens Center", description: "A landmark theatre for classic performances and premiere stage nights." },
        { name: "National Theatre", location: "Omonia", description: "A major theatre venue for drama, tragedy, and contemporary productions." },
        { name: "Royal Grand Theatre", location: "Syntagma", description: "An elegant theatre with a grand stage and historic atmosphere." },
        { name: "Athens Playhouse", location: "Plaka", description: "An intimate playhouse for modern drama and experimental stage work." },
        { name: "Odeon Modern", location: "Marousi", description: "A contemporary theatre venue for musicals, comedies, and new productions." },
        { name: "City Opera House", location: "Kallithea", description: "A refined venue for opera, ballet, and large-scale musical theatre." }
    ];

    const showsData = [
        { title: "The Great Gatsby", category: "Drama", desc: "A stage adaptation of Jazz Age decadence and ambition.", dur: 120, price: 25 },
        { title: "Waiting for Godot", category: "Drama", desc: "A landmark absurdist play about waiting, hope, and uncertainty.", dur: 125, price: 22 },
        { title: "The Lion King", category: "Musical", desc: "A musical theatre production with powerful songs and stage spectacle.", dur: 118, price: 40 },
        { title: "Phantom of the Opera", category: "Opera", desc: "A dramatic stage production set inside a grand opera house.", dur: 140, price: 50 },
        { title: "Hamlet", category: "Classic", desc: "Shakespeare's classic tragedy of revenge, doubt, and power.", dur: 180, price: 30 },
        { title: "Les Misérables", category: "Musical", desc: "A large-scale musical theatre production about justice, love, and revolution.", dur: 160, price: 45 },
        { title: "Romeo and Juliet", category: "Tragedy", desc: "Shakespeare's tragic love story brought to the stage.", dur: 150, price: 28 },
        { title: "Chicago", category: "Musical", desc: "A stylish musical theatre performance full of rhythm, satire, and drama.", dur: 125, price: 35 },
        { title: "Macbeth", category: "Tragedy", desc: "Shakespeare's dark tragedy of ambition, fate, and guilt.", dur: 135, price: 32 },
        { title: "Swan Lake", category: "Ballet", desc: "A classical ballet performance with iconic music and choreography.", dur: 155, price: 55 },
        { title: "A Streetcar Named Desire", category: "Drama", desc: "A powerful stage drama about desire, conflict, and emotional collapse.", dur: 140, price: 29 },
        { title: "The Mousetrap", category: "Thriller", desc: "A classic theatre mystery thriller with suspenseful twists.", dur: 130, price: 22 },
        { title: "Medea", category: "Tragedy", desc: "A Greek tragedy of betrayal, rage, and devastating revenge.", dur: 115, price: 24 },
        { title: "Antigone", category: "Tragedy", desc: "A classical Greek tragedy about duty, law, and moral resistance.", dur: 110, price: 24 },
        { title: "Death of a Salesman", category: "Drama", desc: "A modern stage drama about family, dreams, and disillusionment.", dur: 145, price: 27 },
        { title: "The Glass Menagerie", category: "Drama", desc: "A memory play about family, fragility, and escape.", dur: 125, price: 26 },
        { title: "The Importance of Being Earnest", category: "Comedy", desc: "Oscar Wilde's classic comedy of manners, full of mistaken identities, sharp wit, and social satire.", dur: 130, price: 28 },
        { title: "A Midsummer Night's Dream", category: "Comedy", desc: "Shakespeare's magical stage comedy of love, mischief, fairies, and mistaken affections.", dur: 140, price: 30 },
        { title: "The Comedy of Errors", category: "Comedy", desc: "Shakespeare's fast-paced farce of mistaken identity, twins, confusion, and comic chaos.", dur: 115, price: 24 },
        { title: "Noises Off", category: "Comedy", desc: "A backstage farce about a theatre company whose production hilariously falls apart.", dur: 125, price: 26 }
    ];

    const savedTheaters = [];
    for (const theaterData of theaters) {
        const theater = theaterRepo.create(theaterData);
        savedTheaters.push(await theaterRepo.save(theater));
    }

    const hallNames = ["Main Hall", "Black Box Stage", "Grand Stage", "Studio Stage", "Opera Hall", "Ballet Hall"];
    const hours = [18, 19, 20, 21];

    for (let i = 0; i < showsData.length; i++) {
        const data = showsData[i];
        const theater = savedTheaters[i % savedTheaters.length];
        const show = showRepo.create({
            title: data.title,
            category: data.category,
            description: data.desc,
            duration: data.dur,
            age_rating: "PG-13",
            theater,
            image_url: ""
        });
        await showRepo.save(show);

        for (let k = 0; k < 4; k++) {
            const st = showtimeRepo.create({
                start_time: new Date(Date.now() + 86400000 * k + hours[k] * 3600000),
                price: data.price,
                hall_name: hallNames[(i + k) % hallNames.length],
                show
            });
            await showtimeRepo.save(st);

            for (let rowIdx = 0; rowIdx < 6; rowIdx++) {
                const row = String.fromCharCode(65 + rowIdx);
                for (let num = 1; num <= 10; num++) {
                    const seat = seatRepo.create({ row, number: num, showtime: st });
                    await seatRepo.save(seat);
                }
            }
        }
    }

    console.log("Database seeded successfully!");
    process.exit(0);
};

seed();
