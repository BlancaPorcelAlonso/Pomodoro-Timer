
//conjunto de reglas y protocolos que permite que dos aplicaciones de software 
//se comuniquen entre sí y compartan datos. Actúa como un intermediario o "puente" 
// que facilita la interacción sin necesidad de conocer los detalles internos de cómo funciona cada sistema. 

const minutesDisplay = document.getElementById("minutes"); //document = todo el html 
const secondsDisplay = document.getElementById("seconds"); //getElementById buscame el elemento con esta id 
const settingsModal = document.getElementById('settingsModal');
const settingsBtn = document.getElementById("settingsBtn");
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');

const startButton = document.querySelector(".btn_start");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

const workTimeInput = document.getElementById("workTime");
const breakTimeInput = document.getElementById("breakTime");
const watcher = document.getElementById('watcher');

const musicButton = document.getElementById("musicBtn");
const audio = document.getElementById("myAudio");
const motivationDisplay = document.getElementById("motivationDisplay");

// Valores por defecto
let workMinutes = 25;   // <-- FALTABA
let breakMinutes = 5;   // <-- FALTABA

let totalTime = 25 * 60;  // Tiempo total en segundos 

let isRunning = false;
let timerInterval = null;
let isWorkTime = true; // true = trabajo, false = descanso

function updateMotivation() {
    if (isWorkTime) {
        motivationDisplay.textContent = "Deep focus mode. Build your future.";
    } else {
        motivationDisplay.textContent = "Relax. Your mind deserves this pause.";
    }
}
function updateDisplay() {
    const minutes = Math.floor(totalTime / 60); // minutos enteros
    const seconds = totalTime % 60;             // resto de segundos

    // padStart pone 0 delante si es 1 dígito -
    minutesDisplay.textContent = String(minutes).padStart(2, "0");
    secondsDisplay.textContent = String(seconds).padStart(2, "0");
}

// Función que empieza la cuenta atrás
function startTimer() {
    if (!isRunning) { // si ya está corriendo, no hagas nada
        isRunning = true;

        timerInterval = setInterval(() => {
            if (totalTime > 0) {
                totalTime--;       // resta 1 segundo
                updateDisplay();   // actualiza el reloj en pantalla
            } else {
                clearInterval(timerInterval);
                isRunning = false;

                // Cambia a descanso o a trabajo (según donde estés)
                if (isWorkTime) {
                    isWorkTime = false;
                    totalTime = breakMinutes * 60;   // carga descanso
                } else {
                    isWorkTime = true;
                    totalTime = workMinutes * 60;    // vuelve a trabajo
                }

                updateDisplay(); // pinta el nuevo tiempo en pantalla
                updateMotivation();
            }
        }, 1000); // cada 1000ms = 1 segundo
    }
}


function openSettings() {
    workTimeInput.value = workMinutes;
    breakTimeInput.value = breakMinutes;
    settingsModal.classList.add("active");
}

function closeSettings() {
    settingsModal.classList.remove("active");
}

function saveSettings() {
    workMinutes = parseInt(workTimeInput.value) || 25;
    breakMinutes = parseInt(breakTimeInput.value) || 5;
    resetTimer();
    closeSettings();
}


function pauseTimer() {
    if (!isRunning) return;        // si ya está pausado, no hace nada
    clearInterval(timerInterval);
    isRunning = false;
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;

  totalTime = (isWorkTime ? workMinutes : breakMinutes) * 60;
  updateDisplay();
  updateMotivation();
}

function completeSession() {
    clearInterval(timerInterval);
    isRunning = false;
    startBtn.textContent = 'Start';
    watcher.classList.remove('active');

    // Play notification sound
    playNotificationSound();

    if (isWorkTime) {
        motivationDisplay.textContent = "Great work! Time for a break!";
        isWorkTime = false;
        totalSeconds = breakMinutes * 60;
    } else {
        motivationDisplay.textContent = "Break's over! Ready to focus?";
        isWorkTime = true;
        totalSeconds = workMinutes * 60;
    }

    updateDisplay();

    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Pomodoro Timer', {
            body: isWorkTime ? 'Time to work!' : 'Time for a break!',
            icon: '⏱️'
        });
    }
}

function optionAudio(){
     if (audio.paused) {
      audio.play();                   
      btn.setAttribute("aria-label", "Pausar audio");
    } else {
      audio.pause();
      btn.setAttribute("aria-label", "Reproducir audio");
    }
}

// 5) Al cargar, pinta el tiempo inicial
updateDisplay();
updateMotivation();

startButton.addEventListener("click", startTimer);
settingsBtn.addEventListener("click", openSettings);
saveBtn.addEventListener("click", saveSettings);
cancelBtn.addEventListener("click", closeSettings);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
musicButton.addEventListener("click", optionAudio);