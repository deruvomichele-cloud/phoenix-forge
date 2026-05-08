export type PhoenixQuote = { text: string; author: string; origin?: string };
export const QUOTES: PhoenixQuote[] = [
  { text:"The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.", author:"Steve Jobs" },
  { text:"In the middle of every difficulty lies opportunity. The measure of intelligence is the ability to change.", author:"Albert Einstein" },
  { text:"It does not matter how slowly you go as long as you do not stop. Our greatest glory is not in never failing, but in rising every time we fall.", author:"Confucio" },
  { text:"You must be the change you wish to see in the world. The weak can never forgive. Forgiveness is the attribute of the strong.", author:"Mahatma Gandhi" },
  { text:"Darkness cannot drive out darkness; only light can do that. Hate cannot drive out hate; only love can do that.", author:"Martin Luther King Jr." },
  { text:"The greatest glory in living lies not in never falling, but in rising every time we fall. What counts in life is not the mere fact that we have lived.", author:"Nelson Mandela" },
  { text:"Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.", author:"Albert Einstein" },
  { text:"Life is what happens when you're busy making other plans. And in the end, the love you take is equal to the love you make.", author:"John Lennon" },
  { text:"It is better to be feared than loved, if you cannot be both. Men are so simple and so much inclined to obey immediate needs that a deceiver will never lack victims.", author:"Niccolò Machiavelli" },
  { text:"All warfare is based on deception. Hence, when we are able to attack, we must seem unable; when using our forces, we must appear inactive.", author:"Sun Tzu" },
  { text:"Power is not a means; it is an end. One does not establish a dictatorship in order to safeguard a revolution; one makes the revolution in order to establish the dictatorship.", author:"George Orwell", origin:"1984" },
  { text:"Why so serious? Let's put a smile on that face. Introduce a little anarchy, upset the established order, and everything becomes chaos. I'm an agent of chaos.", author:"The Joker", origin:"The Dark Knight" },
  { text:"I'm going to make him an offer he can't refuse. Leave the gun. Take the cannoli. A man who doesn't spend time with his family can never be a real man.", author:"Don Corleone", origin:"Il Padrino" },
  { text:"Do, or do not. There is no try. Fear is the path to the dark side. Fear leads to anger, anger leads to hate, hate leads to suffering.", author:"Yoda", origin:"Star Wars" },
  { text:"I find your lack of faith disturbing. The Force is strong with this one. You don't know the power of the dark side.", author:"Darth Vader", origin:"Star Wars" },
  { text:"You either die a hero, or you live long enough to see yourself become the villain. You thought we could be decent men in an indecent time!", author:"Harvey Dent", origin:"The Dark Knight" },
  { text:"What we do in life echoes in eternity. My name is Maximus Decimus Meridius, commander of the Armies of the North, General of the Felix Legions.", author:"Maximus Meridius", origin:"Il Gladiatore" },
  { text:"Get busy living, or get busy dying. Hope is a good thing, maybe the best of things, and no good thing ever dies.", author:"Andy Dufresne", origin:"The Shawshank Redemption" },
  { text:"I am inevitable. You could not live with your own failure, and where did that bring you? Back to me.", author:"Thanos", origin:"Avengers: Endgame" },
  { text:"I am Iron Man. And I swear on my daughter's life that whoever sends that thing, I will find them and use everything in my power to destroy them.", author:"Tony Stark", origin:"Avengers: Endgame" },
  { text:"When you play the game of thrones, you win or you die. There is no middle ground. I will not become a page in someone else's history book.", author:"Cersei Lannister", origin:"Game of Thrones" },
  { text:"Power resides where men believe it resides. It's a trick, a shadow on the wall. And a very small man can cast a very large shadow.", author:"Lord Varys", origin:"Game of Thrones" },
  { text:"A Lannister always pays his debts. The lion does not concern himself with the opinion of the sheep. Any man who must say I am the king is no true king.", author:"Tywin Lannister", origin:"Game of Thrones" },
  { text:"War. War never changes. In the 21st century, war was still waged over the resources that could be acquired. Only this time, the spoils of war were also its weapons.", author:"The Narrator", origin:"Fallout" },
  { text:"A man chooses. A slave obeys. In what sense am I human if I have no choice? The city is my response to the Parasites.", author:"Andrew Ryan", origin:"BioShock" },
  { text:"Praise the Sun! Without a doubt, one of the greatest joys life can offer. Perhaps you have a fire of your own? Let that fire burn bright!", author:"Solaire di Astora", origin:"Dark Souls" },
  { text:"The cake is a lie. We do what we must because we can. For the good of all of us — except the ones who are dead.", author:"GLaDOS", origin:"Portal" },
  { text:"We must destroy them all. Your kind cannot coexist with us. The organic species of this galaxy are nothing. We are the pinnacle of evolution.", author:"Sovereign", origin:"Mass Effect" },
  { text:"I used to be an adventurer like you, then I took an arrow in the knee. But I've seen things you wouldn't believe. Dragonfire over the Throat of the World.", author:"Guardia di Whiterun", origin:"Skyrim" },
  { text:"It's dangerous to go alone! Take this. Courage need not be remembered, for it is never forgotten.", author:"Old Man", origin:"The Legend of Zelda" },
];
export function pickQuoteForNft(createdAt: number, seed?: string): PhoenixQuote {
  const seedVal = seed ? seed.split('').reduce((acc,c)=>acc+c.charCodeAt(0),0) : 0;
  return QUOTES[Math.abs(createdAt+seedVal) % QUOTES.length];
}
