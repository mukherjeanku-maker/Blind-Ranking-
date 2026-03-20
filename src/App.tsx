/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Player, players } from './data';

function calculateScore(player: Player): number {
  const { avg, sr, runs, wickets, econ, impact } = player.stats;
  let score = 0;
  if (player.role === 'Batting') {
    score = (avg * 0.30) + (sr * 0.25) + (runs * 0.20) + (impact * 0.25);
  } else if (player.role === 'Bowling') {
    score = (wickets * 0.30) + ((1 / (econ || 1)) * 0.25) + ((1 / (avg || 1)) * 0.20) + (impact * 0.25);
  } else {
    const batScore = (avg * 0.30) + (sr * 0.25) + (runs * 0.20);
    const bowlScore = (wickets * 0.30) + ((1 / (econ || 1)) * 0.25) + ((1 / (avg || 1)) * 0.20);
    score = ((batScore + bowlScore) / 2) + impact;
  }
  return score;
}

const commentaries = [
  "A true match-winner on his day!",
  "Can he hold his nerve in the death overs?",
  "The opposition captain is worried about this one.",
  "A classic player who knows how to build an innings.",
  "He brings so much energy to the field!",
  "A specialist who can turn the game around instantly.",
  "Consistency is his middle name.",
  "He's been in fine form recently.",
  "A real threat with both bat and ball.",
  "The crowd loves watching him play."
];

export default function App() {
  const [gameState, setGameState] = useState<'playing' | 'finished'>('playing');
  const [round, setRound] = useState(0);
  const [selectedPlayers] = useState(() => [...players].sort(() => 0.5 - Math.random()).slice(0, 10));
  const [userSlots, setUserSlots] = useState<(Player | null)[]>(Array(10).fill(null));
  const [takenSlots, setTakenSlots] = useState<boolean[]>(Array(10).fill(false));
  const [commentary] = useState(() => commentaries[Math.floor(Math.random() * commentaries.length)]);

  const currentPlayer = selectedPlayers[round];

  const handleSlotSelection = (slotIndex: number) => {
    if (takenSlots[slotIndex]) return;
    
    const newSlots = [...userSlots];
    newSlots[slotIndex] = currentPlayer;
    setUserSlots(newSlots);
    
    const newTakenSlots = [...takenSlots];
    newTakenSlots[slotIndex] = true;
    setTakenSlots(newTakenSlots);
    
    if (round < 9) {
      setRound(round + 1);
    } else {
      setGameState('finished');
    }
  };

  const trueRanking = useMemo(() => {
    return [...selectedPlayers].sort((a, b) => calculateScore(b) - calculateScore(a));
  }, [selectedPlayers]);

  if (gameState === 'finished') {
    const totalError = userSlots.reduce((acc, player, index) => {
      if (!player) return acc;
      const trueRank = trueRanking.findIndex(p => p.id === player.id);
      return acc + Math.abs(index - trueRank);
    }, 0);
    const accuracy = Math.max(0, (1 - (totalError / 90)) * 100);

    return (
      <div className="p-6 bg-zinc-950 text-zinc-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-6 text-emerald-400">📈 FINAL POST-MATCH PRESENTATION (AFTER ROUND 10)</h1>
        <h2 className="text-xl font-bold mb-6 text-emerald-400">🏆 MATCH REPORT & ANALYTICS</h2>
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 mb-6">
          <p className="text-xl mb-2">✅ ACCURACY SCORE: {accuracy.toFixed(1)}%</p>
          <p className="text-xl">🧠 CRICKET IQ VERDICT: {accuracy >= 80 ? 'Legendary' : accuracy >= 50 ? 'Pro' : accuracy >= 20 ? 'Rookie' : 'Gully Cricketer'}</p>
        </div>
        <table className="w-full border-collapse border border-zinc-700 mb-6">
          <thead>
            <tr className="bg-zinc-900">
              <th className="border border-zinc-700 p-2">Rank</th>
              <th className="border border-zinc-700 p-2">Your Pick</th>
              <th className="border border-zinc-700 p-2">True Rank (Stats)</th>
              <th className="border border-zinc-700 p-2">Delta</th>
            </tr>
          </thead>
          <tbody>
            {userSlots.map((player, index) => {
              if (!player) return null;
              const trueRank = trueRanking.findIndex(p => p.id === player.id);
              return (
                <tr key={player.id}>
                  <td className="border border-zinc-700 p-2 text-center">{index + 1}</td>
                  <td className="border border-zinc-700 p-2">{player.name}</td>
                  <td className="border border-zinc-700 p-2">{trueRanking[index].name}</td>
                  <td className="border border-zinc-700 p-2 text-center">{Math.abs(index - trueRank)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="bg-zinc-900 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2 text-emerald-400">🎙️ EXPERT ANALYSIS:</h2>
          <p>"The #1 spot belongs to {trueRanking[0].name} because of their exceptional impact and balanced stats."</p>
        </div>
        <div className="bg-zinc-900 p-4 rounded-lg mt-6">
          <h2 className="text-xl font-bold mb-2 text-emerald-400">📱 SHARE YOUR SCORE:</h2>
          <a
            href={`https://wa.me/917908978561?text=Hey%20Anku!%20My%20IPL%20Blind%20Ranking%20Accuracy%20is%20${accuracy.toFixed(1)}%25%20🔥`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-700 transition"
          >
            Share on WhatsApp 💬
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-zinc-950 text-zinc-100 min-h-screen">
      <div className="border border-emerald-500 p-4 mb-6 text-center">
        <h1 className="text-2xl font-bold text-emerald-400">🏏 IPL BLIND RANKING | ROUND {round + 1}/10</h1>
      </div>
      <div className="mb-8 p-6 bg-zinc-900 rounded-xl border border-zinc-700">
        <p className="text-sm text-zinc-400 uppercase tracking-widest mb-2">🔥 NEXT PLAYER ON THE CREASE:</p>
        <p className="text-4xl font-bold text-emerald-300">⭐ ━━━━━━━━━━━ {currentPlayer.name} ━━━━━━━━━━━ ⭐</p>
      </div>
      <div className="mb-6">
        <p className="text-sm text-zinc-400 uppercase tracking-widest mb-4">📊 YOUR DASHBOARD (EMPTY SLOTS):</p>
        <div className="grid grid-cols-5 gap-4">
          {takenSlots.map((taken, index) => (
            <button
              key={index}
              onClick={() => handleSlotSelection(index)}
              disabled={taken}
              className={`p-4 border rounded-lg text-lg font-bold ${taken ? 'bg-zinc-800 text-zinc-600 border-zinc-700 line-through' : 'bg-zinc-800 hover:bg-emerald-900 border-emerald-500'}`}
            >
              {taken ? '❌' : `[ ${index + 1} ]`}
            </button>
          ))}
        </div>
      </div>
      <div className="border-t border-zinc-700 pt-4">
        <p className="text-sm text-zinc-400 uppercase tracking-widest mb-2">📣 COMMENTARY:</p>
        <p className="text-lg italic text-zinc-300">"{commentary}"</p>
      </div>
      <p className="text-lg mt-4">👉 Assign a slot for {currentPlayer.name}:</p>
    </div>
  );
}
