export const getShowImage = (title: string) => {
  try {
    switch (title) {
      case 'The Great Gatsby': return require('../assets/shows/gatsby.jpg');
      case 'Waiting for Godot': return require('../assets/shows/waiting-for-godot.jpg');
      case 'The Lion King': return require('../assets/shows/lion-king.jpg');
      case 'Phantom of the Opera': return require('../assets/shows/phantom-opera.jpg');
      case 'Hamlet': return require('../assets/shows/hamlet.jpg');
      case 'Les Misérables': return require('../assets/shows/les-miserables.jpg');
      case 'Romeo and Juliet': return require('../assets/shows/romeo-juliet.jpg');
      case 'Chicago': return require('../assets/shows/chicago.jpg');
      case 'Macbeth': return require('../assets/shows/macbeth.jpg');
      case 'Swan Lake': return require('../assets/shows/swan-lake.jpg');
      case 'A Streetcar Named Desire': return require('../assets/shows/streetcar.jpg');
      case 'The Mousetrap': return require('../assets/shows/mousetrap.jpg');
      case 'Medea': return require('../assets/shows/medea.jpg');
      case 'Antigone': return require('../assets/shows/antigone.jpg');
      case 'Death of a Salesman': return require('../assets/shows/death-of-salesman.jpg');
      case 'The Glass Menagerie': return require('../assets/shows/the-glass-menagerie.jpg');
      case 'The Importance of Being Earnest': return require('../assets/shows/the-importance-of-being-earnest.jpg');
      case "A Midsummer Night's Dream": return require('../assets/shows/midsummer-nights-dream.jpg');
      case 'The Comedy of Errors': return require('../assets/shows/the-comedy-of-errors.jpg');
      case 'Noises Off': return require('../assets/shows/noisesoff.jpg');
      default: return null;
    }
  } catch (e) {
    return null;
  }
};
