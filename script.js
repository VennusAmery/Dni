        document.addEventListener('DOMContentLoaded', function() {
            // Elementos DOM
            const yesBtn = document.getElementById('yesBtn');
            const noBtn = document.getElementById('noBtn');
            const sadMessage = document.getElementById('sadMessage');
            const calendarContainer = document.getElementById('calendarContainer');
            const confirmation = document.getElementById('confirmation');
            const confirmationDetails = document.getElementById('confirmationDetails');
            const dateInput = document.getElementById('date');
            const timeInput = document.getElementById('time');
            const confirmBtn = document.getElementById('confirmBtn');
            const darkModeToggle = document.getElementById('darkModeToggle');
            const bubblesContainer = document.getElementById('bubbles');
            const ducklettImg = document.getElementById('ducklettImg');
            const mainMessage = document.getElementById('mainMessage');
            const buttonsContainer = document.getElementById('buttonsContainer');
            const resetBtn = document.getElementById('resetBtn');
            
            // Variables para el comportamiento del botón "No"
            let noClickCount = 0;
            
            // Mensajes de tristeza
            const sadMessages = [
                "¡Ducklett está triste!",
                "¡No me ignores!",
                "¿Por qué me rechazas?",
                "¡Quiero ser tu amigo!",
                "¡Vamos, di que sí!",
                "¡No seas así!",
                "¡Por favor!",
                "Ducklett se pondrá a llorar...",
                "¡Eres cruel!",
                "¡Esto duele!"
            ];
            
            // Establecer fecha mínima como hoy
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            dateInput.min = `${yyyy}-${mm}-${dd}`;
            
            // Inicializar la página
            function initPage() {
                // Limpiar localStorage para pruebas (quitar esta línea en producción)
                // localStorage.removeItem('ducklettAppointment');
                
                // Cargar cita guardada si existe
                const savedAppointment = localStorage.getItem('ducklettAppointment');
                if (savedAppointment) {
                    const appointment = JSON.parse(savedAppointment);
                    confirmationDetails.textContent = `Tu cita con Ducklett es el ${appointment.formattedDate} a las ${appointment.formattedTime}.`;
                    confirmation.style.display = 'block';
                    document.querySelector('.buttons-container').style.display = 'none';
                    mainMessage.textContent = "¡Ya tienes una cita programada con Ducklett!";
                } else {
                    // Mostrar la interfaz inicial si no hay cita guardada
                    buttonsContainer.style.display = 'flex';
                    mainMessage.textContent = "¡Hola! Soy Ducklett, el Pokémon pato acuático. ¿Te gustaría conversar conmigo?";
                }
                
                // Crear burbujas
                createBubbles();
            }
            
            // Crear burbujas
            function createBubbles() {
                for (let i = 0; i < 15; i++) {
                    const bubble = document.createElement('div');
                    bubble.classList.add('bubble');
                    
                    // Tamaño aleatorio
                    const size = Math.random() * 30 + 10;
                    bubble.style.width = `${size}px`;
                    bubble.style.height = `${size}px`;
                    
                    // Posición aleatoria
                    bubble.style.left = `${Math.random() * 100}%`;
                    
                    // Retraso y duración de animación aleatorios
                    bubble.style.animationDelay = `${Math.random() * 10}s`;
                    bubble.style.animationDuration = `${Math.random() * 10 + 10}s`;
                    
                    bubblesContainer.appendChild(bubble);
                }
            }
            
            // Efecto de sonido (simulado)
            function playSound(type) {
                // En un caso real, aquí se reproduciría un sonido
                console.log(`Reproduciendo sonido: ${type}`);
            }
            
            // Modo oscuro
            darkModeToggle.addEventListener('click', function() {
                document.body.classList.toggle('dark-mode');
                darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
            });
            
            // Crear mensaje flotante
            function createFloatingMessage() {
                const message = document.createElement('div');
                message.classList.add('floating-message');
                message.textContent = sadMessages[Math.floor(Math.random() * sadMessages.length)];
                
                // Posicionar más arriba para que no se tape con los botones
                const containerRect = buttonsContainer.getBoundingClientRect();
                const x = Math.random() * (containerRect.width - 150);
                // Ajustar posición Y para que aparezcan más arriba
                const y = Math.random() * 50; // Solo en la parte superior del contenedor
                
                message.style.left = `${x}px`;
                message.style.top = `${y}px`;
                
                buttonsContainer.appendChild(message);
                
                // Eliminar el mensaje después de la animación
                setTimeout(() => {
                    if (message.parentNode) {
                        message.remove();
                    }
                }, 3000);
            }
            
            // Crear Ducklett flotante
            function createFloatingDucklett() {
                const floatingDucklett = document.createElement('div');
                floatingDucklett.classList.add('floating-ducklett');
                
                const img = document.createElement('img');
                img.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/580.png";
                img.alt = "Ducklett triste";
                
                floatingDucklett.appendChild(img);
                
                // Posicionar más arriba para que no se tape con los botones
                const containerRect = buttonsContainer.getBoundingClientRect();
                const x = Math.random() * (containerRect.width - 60);
                // Ajustar posición Y para que aparezcan más arriba
                const y = Math.random() * 40; // Solo en la parte superior del contenedor
                
                floatingDucklett.style.left = `${x}px`;
                floatingDucklett.style.top = `${y}px`;
                
                buttonsContainer.appendChild(floatingDucklett);
                
                // Eliminar el Ducklett después de la animación
                setTimeout(() => {
                    if (floatingDucklett.parentNode) {
                        floatingDucklett.remove();
                    }
                }, 4000);
            }
            
            // Reducir tamaño del botón "No"
            function shrinkNoButton() {
                noClickCount++;
                
                // Calcular nuevo tamaño (mínimo 30% del original)
                const scale = Math.max(0.3, 1 - (noClickCount * 0.15));
                noBtn.style.transform = `scale(${scale})`;
                
                // Cambiar el texto después de varios clics
                if (noClickCount >= 3) {
                    noBtn.textContent = "No 😢";
                }
                if (noClickCount >= 5) {
                    noBtn.textContent = "No 😭";
                }
                
                // Si se hace muy pequeño, restablecer después de un tiempo
                if (noClickCount >= 7) {
                    setTimeout(() => {
                        noClickCount = 0;
                        noBtn.style.transform = 'scale(1)';
                        noBtn.textContent = "No";
                    }, 2000);
                }
            }
            
            // Cuando se hace clic en "No"
            noBtn.addEventListener('click', function() {
                playSound('sad');
                
                // Reducir el botón
                shrinkNoButton();
                
                // Crear mensajes flotantes (más arriba)
                createFloatingMessage();
                createFloatingMessage();
                
                // Crear Ducklett flotante (más arriba)
                if (noClickCount % 2 === 0) {
                    createFloatingDucklett();
                }
                
                // Cambiar imagen a triste
                ducklettImg.style.filter = "brightness(0.8) sepia(0.5)";
                
                // Mostrar mensaje de tristeza después de varios clics
                if (noClickCount >= 3) {
                    sadMessage.style.display = 'block';
                }
                
                // Hacer que el botón Sí parpadee para llamar la atención
                yesBtn.style.animation = 'pulse 0.5s 3';
                setTimeout(() => {
                    yesBtn.style.animation = '';
                }, 1500);
            });
            
            // Cuando se hace clic en "Sí"
            yesBtn.addEventListener('click', function() {
                playSound('happy');
                
                // Restaurar el botón "No"
                noClickCount = 0;
                noBtn.style.transform = 'scale(1)';
                noBtn.textContent = "No";
                
                // Restaurar imagen
                ducklettImg.style.filter = "none";
                
                // Ocultar mensaje de tristeza
                sadMessage.style.display = 'none';
                
                // Mostrar calendario
                calendarContainer.style.display = 'block';
                
                // Ocultar botones
                document.querySelector('.buttons-container').style.display = 'none';
                
                // Cambiar mensaje principal
                mainMessage.textContent = "¡Genial! Ducklett está emocionado de hablar contigo.";
            });
            
            // Cuando se confirma la cita
            confirmBtn.addEventListener('click', function() {
                const date = dateInput.value;
                const time = timeInput.value;
                
                if (!date || !time) {
                    alert("Por favor, selecciona una fecha y hora.");
                    return;
                }
                
                // Validar que la fecha no sea en el pasado
                const selectedDateTime = new Date(`${date}T${time}`);
                if (selectedDateTime < new Date()) {
                    alert("Por favor, selecciona una fecha y hora futuras.");
                    return;
                }
                
                // Formatear fecha en español
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                const formattedDate = selectedDateTime.toLocaleDateString('es-ES', options);
                const formattedTime = selectedDateTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                
                // Mostrar confirmación
                confirmationDetails.textContent = `Tu cita con Ducklett es el ${formattedDate} a las ${formattedTime}.`;
                confirmation.style.display = 'block';
                calendarContainer.style.display = 'none';
                
                // Reproducir sonido de celebración
                playSound('celebration');
                
                // Guardar en localStorage
                localStorage.setItem('ducklettAppointment', JSON.stringify({
                    date: date,
                    time: time,
                    formattedDate: formattedDate,
                    formattedTime: formattedTime
                }));
                
                // Animación de celebración
                createCelebrationBubbles();
            });
            
            // Botón de reinicio
            resetBtn.addEventListener('click', function() {
                // Eliminar cita guardada
                localStorage.removeItem('ducklettAppointment');
                
                // Restablecer interfaz
                confirmation.style.display = 'none';
                buttonsContainer.style.display = 'flex';
                mainMessage.textContent = "¡Hola! Soy Ducklett, el Pokémon pato acuático. ¿Te gustaría conversar conmigo?";
                
                // Restablecer botón "No"
                noClickCount = 0;
                noBtn.style.transform = 'scale(1)';
                noBtn.textContent = "No";
                
                // Restablecer imagen
                ducklettImg.style.filter = "none";
                
                // Ocultar mensaje de tristeza
                sadMessage.style.display = 'none';
            });
            
            // Inicializar la página
            initPage();
            
            // Crear burbujas de celebración
            function createCelebrationBubbles() {
                for (let i = 0; i < 30; i++) {
                    const bubble = document.createElement('div');
                    bubble.classList.add('bubble');
                    
                    // Tamaño aleatorio
                    const size = Math.random() * 20 + 5;
                    bubble.style.width = `${size}px`;
                    bubble.style.height = `${size}px`;
                    
                    // Posición aleatoria
                    bubble.style.left = `${Math.random() * 100}%`;
                    
                    // Color amarillo para celebración
                    bubble.style.backgroundColor = 'rgba(255, 222, 0, 0.7)';
                    
                    // Retraso y duración de animación aleatorios
                    bubble.style.animationDelay = `${Math.random() * 2}s`;
                    bubble.style.animationDuration = `${Math.random() * 5 + 5}s`;
                    
                    bubblesContainer.appendChild(bubble);
                    
                    // Eliminar burbuja después de la animación
                    setTimeout(() => {
                        if (bubble.parentNode) {
                            bubble.remove();
                        }
                    }, 15000);
                }
            }
        });