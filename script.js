

// === Initialisation des données du joueur ===
let player = {
  name: "",
  class: "",
  level: 1,

  xp: 0,
  xpToNextLevel: 100,
  quests: [],
  xpLog: []
};

// === Sauvegarde et chargement ===
function saveGame() {
  localStorage.setItem("playerData", JSON.stringify(player));
}

function loadGame() {
  const saved = localStorage.getItem("playerData");
  if (saved) {
    player = JSON.parse(saved);
    updateQuestList();
    updateLevelUI();
    renderXPChart();
  }
}

// === Fonctions de création et gestion ===
function saveCharacter() {
  player.name = document.getElementById("character-name").value.trim();
  player.class = document.getElementById("character-class").value;
  if (!player.name) {
    alert("Merci de renseigner un nom valide.");
    return;
  }
  updateLevelUI();
  saveGame();
}

// Ajouter une quête
function addQuest() {
  const questInput = document.getElementById("quest-input");
  const quest = questInput.value.trim();
  if (quest !== "") {
    player.quests.push(quest);
    questInput.value = "";
    updateQuestList();
    saveGame();
  } else {
    alert("Merci d’écrire une quête valide.");
  }
}

// Afficher la liste des quêtes avec boutons valider
function updateQuestList() {
  const questList = document.getElementById("quest-list");
  questList.innerHTML = "";
  player.quests.forEach((q, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${q}</span> 
      <button onclick="completeQuest(${index})">Valider</button>
    `;
    questList.appendChild(li);
  });
}

// Valider une quête, supprimer de la liste et ajouter XP
function completeQuest(index) {
  player.quests.splice(index, 1);
  gainXP(20);
  updateQuestList();
  saveGame();
}

// Gérer l’XP et passage de niveau
function gainXP(amount) {
  player.xp += amount;
  if (player.xp >= player.xpToNextLevel) {
    player.level++;
    player.xp -= player.xpToNextLevel;
    player.xpToNextLevel += 50;
    alert("✨ Niveau supérieur !");
  }
  logDailyXP();
  updateLevelUI();
  saveGame();
}

// Mettre à jour interface niveau et barre d’XP
function updateLevelUI() {
  document.getElementById("player-level").textContent = `Niveau : ${player.level}`;
  const xpBar = document.getElementById("xp-bar");
  if (xpBar) {
    xpBar.max = player.xpToNextLevel;
    xpBar.value = player.xp;
  }
}

// Suivi journalier de l’XP pour le graphique
function logDailyXP() {
  const today = new Date().toISOString().split("T")[0];
  const existing = player.xpLog.find(entry => entry.date === today);
  if (existing) {
    existing.xp = player.xp;
  } else {
    player.xpLog.push({ date: today, xp: player.xp });
  }
}

// Afficher le graphique d’évolution de l’XP
function renderXPChart() {
  const ctx = document.getElementById("xpChart").getContext("2d");

  // Supprime les charts existants pour éviter doublons
  if (window.xpChartInstance) window.xpChartInstance.destroy();

  const labels = player.xpLog.map(entry => entry.date);
  const data = player.xpLog.map(entry => entry.xp);

  window.xpChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "XP Journalier",
        data: data,
        borderColor: "#00ffc8",
        backgroundColor: "rgba(0, 255, 200, 0.25)",
        tension: 0.3,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 7,
        borderWidth: 3,
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: "#00ffc8",
            font: { family: 'Share Tech Mono', size: 14 }
          },
          grid: {
            color: "#004d55"
          }
        },
        x: {
          ticks: {
            color: "#00ffc8",
            font: { family: 'Share Tech Mono', size: 12 }
          },
          grid: {
            color: "#004d55"
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: "#00ffc8",
            font: { family: 'Orbitron', size: 16 }
          }
        },
        tooltip: {
          backgroundColor: "#002f3f",
          titleFont: { family: 'Orbitron', size: 14 },
          bodyFont: { family: 'Share Tech Mono', size: 12 },
          cornerRadius: 5,
          padding: 10,
          displayColors: false
        }
      }
    }
  });
}

// Chargement automatique à l’ouverture
window.onload = loadGame;
