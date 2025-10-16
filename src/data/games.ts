// /data/games.ts

export interface Game {
  id: number;
  name: string;
  logo: string;
  rating?: number; // optional, có thể thêm
  plays?: number;  // optional, có thể thêm
  category?: string; // optional
}

// Most addicting games
export const mostAddictingGames: Game[] = [
  { id: 1, name: "Flappy Birds", logo: "https://www.pngmart.com/files/12/Flappy-Bird-Logo-PNG-Transparent-Image.png" },
  { id: 2, name: "Tank Royale.io", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdC2KWxN6-6tXKB2GFN-LfAGK3Y_Jn7BHi7A&s" },
  { id: 3, name: "Kitten Cannon", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzJvujnO1IsIM2a5YddXEy_Ht6mx596Ksz5Q&s" },
  { id: 4, name: "Snacks", logo: "https://cdn.tgdd.vn/GameApp/3/225755/Screentshots/slink-io-game-ran-san-moi-nhieu-nguoi-choi-logo-09-07-2020.png" },
  { id: 5, name: "Bloons", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Bloons_TD_6_logo.webp" },
  { id: 6, name: "Angry Birds", logo: "https://i.pinimg.com/736x/01/7b/48/017b48f105586cefd614527f0806dc4f.jpg" },
];

// New games
export const newGames: Game[] = [
  { id: 7, name: "New Game 1", logo: "https://via.placeholder.com/150" },
  { id: 8, name: "New Game 2", logo: "https://via.placeholder.com/150" },
  { id: 9, name: "New Game 3", logo: "https://via.placeholder.com/150" },
  { id: 10, name: "New Game 4", logo: "https://via.placeholder.com/150" },
  { id: 11, name: "New Game 5", logo: "https://via.placeholder.com/150" },
  { id: 12, name: "New Game 6", logo: "https://via.placeholder.com/150" },
];
