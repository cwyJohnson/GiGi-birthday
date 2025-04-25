$(document).ready(function() {
    // Questions and answers
    const questions = {
        1: { question: "What is the birthday person's favorite color?", answer: "blue" },
        2: { question: "What is the birthday person's favorite animal?", answer: "口水雞" },
        3: { question: "What is the birthday person's birth month?", answer: "小八" }
    };

    let currentQuestion = 1;
    let fireworksAnimationId = null;

    // Fireworks effect
    function startFireworks() {
        const canvas = document.getElementById('fireworksCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        function Particle(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 5 + 2;
            this.speedX = Math.random() * 6 - 3;
            this.speedY = Math.random() * 6 - 3;
            this.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
        }
        Particle.prototype.update = function() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.size *= 0.95;
        };
        Particle.prototype.draw = function() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        };

        function createFirework() {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            for (let i = 0; i < 100; i++) {
                particles.push(new Particle(x, y));
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (Math.random() < 0.1) createFirework();
            particles.forEach((particle, index) => {
                particle.update();
                particle.draw();
                if (particle.size < 0.2) particles.splice(index, 1);
            });
            fireworksAnimationId = requestAnimationFrame(animate);
        }

        animate();
    }

    function stopFireworks() {
        if (fireworksAnimationId) {
            cancelAnimationFrame(fireworksAnimationId);
            fireworksAnimationId = null;
            const canvas = document.getElementById('fireworksCanvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    }

    // Show congrats message
    function showCongrats() {
        $('#congrats').show();
        anime({
            targets: '#congrats',
            opacity: [0, 1],
            scale: [0.5, 1],
            duration: 500,
            easing: 'easeOutQuad',
            complete: function() {
                setTimeout(() => {
                    anime({
                        targets: '#congrats',
                        opacity: 0,
                        scale: 0.5,
                        duration: 500,
                        easing: 'easeInQuad',
                        complete: function() {
                            $('#congrats').hide();
                        }
                    });
                }, 1500);
            }
        });
    }

    // Handle question submission
    $('.submit-btn').on('click', function() {
        const questionDiv = $(this).closest('.question-container');
        const questionId = questionDiv.attr('id').split('-')[1];
        const answer = questionDiv.find('input[name="answer"]:checked').val();
        const correctAnswer = questions[questionId].answer;

        if (!answer) {
            questionDiv.find('.error').text('Please select an answer!').show();
            return;
        }

        if (answer === correctAnswer) {
            stopFireworks();
            startFireworks();
            showCongrats();
            setTimeout(() => {
                if (questionId < 3) {
                    questionDiv.removeClass('active');
                    anime({
                        targets: `#question-${questionId}`,
                        opacity: 0,
                        duration: 500,
                        easing: 'easeInOutQuad',
                        complete: function() {
                            questionDiv.hide();
                            stopFireworks();
                            const nextQuestion = parseInt(questionId) + 1;
                            $(`#question-${nextQuestion}`).show();
                            anime({
                                targets: `#question-${nextQuestion}`,
                                opacity: [0, 1],
                                duration: 500,
                                easing: 'easeInOutQuad'
                            });
                            $(`#question-${nextQuestion}`).addClass('active');
                            currentQuestion = nextQuestion;
                            $(`#question-${nextQuestion} input[name="answer"]`).prop('checked', false);
                            $(`#question-${nextQuestion} .error`).hide();
                        }
                    });
                } else {
                    $.post('/cake', {}, function() {
                        window.location = '/cake';
                    });
                }
            }, 3000);
        } else {
            questionDiv.find('.error').text('Wrong answer, try again!').show();
        }
    });

    // Initialize first question
    $('#question-1').addClass('active').css('opacity', 1);

    // Cake page animations and audio
    if ($('#letter').length) {
        $('#letter').css('display', 'block');
        anime({
            targets: '#letter',
            opacity: [0, 1],
            duration: 2000,
            easing: 'easeInOutQuad'
        });

        const text = "親愛的GIGI,祝你生日快樂啊!有無人話呢~你今日好靚好可愛啊~ 雖然我唔可以係正日同你慶祝,希望下年可以啦(如果之後每一年都可以就會更好)~ 祝你食極唔肥!!祝你長跑長有!!座座山都可以單腳跳上去!台灣玩得開心啲~最緊要安全~ 我會係28號係機場接你架啦!我會等你返黎架! 你既親愛JC";
        const textWrapper = document.querySelector('#letter-text');
        textWrapper.innerHTML = text.split('').map(char => `<span>${char}</span>`).join('');
        anime({
            targets: '#letter-text span',
            opacity: [0, 1],
            translateY: [-20, 0],
            delay: anime.stagger(100, {start: 2000}),
            easing: 'easeOutQuad'
        });

        anime({
            targets: '#happy-birthday',
            opacity: [0, 1],
            scale: [0.5, 1],
            delay: 4000,
            duration: 1000,
            easing: 'easeOutElastic',
            begin: function() {
                $('#happy-birthday').show();
            }
        });

        anime({
            targets: '#album-btn',
            opacity: [0, 1],
            delay: 15000,
            duration: 1000,
            easing: 'easeOutQuad',
            begin: function() {
                $('#album-btn').show();
            }
        });

        // Auto-play birthday song
        const audio = document.getElementById('birthday-song');
        if (audio) {
            audio.play().catch(function(error) {
                console.log('Auto-play failed:', error);
            });
        }

        // Mute/Unmute button
        $('#mute-btn').on('click', function() {
            if (audio.muted) {
                audio.muted = false;
                $(this).text('Mute');
            } else {
                audio.muted = true;
                $(this).text('Unmute');
            }
        });
    }

    // Album page flip and caption animation
    let currentPage = 1;
    const totalPages = 9;

    function animateCaptions(pageId) {
        // Reset captions for all pages
        $('.photo-caption').each(function() {
            const captionText = $(this).data('caption');
            $(this).html(captionText.split('').map(char => `<span>${char}</span>`).join(''));
            $(this).find('span').css({ opacity: 0, transform: 'translateY(-20px)' });
        });

        // Animate captions for the current page
        const $captions = $(`#page-${pageId} .photo-caption span`);
        anime({
            targets: $captions.toArray(),
            opacity: [0, 1],
            translateY: [-20, 0],
            delay: anime.stagger(100, { start: 500 }),
            easing: 'easeOutQuad'
        });
    }

    // Initialize captions and animate first page
    if ($('#album').length) {
        $('.photo-caption').each(function() {
            const captionText = $(this).data('caption');
            $(this).html(captionText.split('').map(char => `<span>${char}</span>`).join(''));
        });
        animateCaptions(1);

        $('.character').each(function() {
            const $character = $(this);
            let isDragging = false;
            let currentX;
            let currentY;
            let initialX;
            let initialY;

            // Mouse events
            $character.on('mousedown', function(e) {
                isDragging = true;
                initialX = e.clientX - currentX;
                initialY = e.clientY - currentY;
                $character.css('cursor', 'grabbing');
                e.preventDefault();
            });

            $(document).on('mousemove', function(e) {
                if (isDragging) {
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                    $character.css({
                        left: currentX + 'px',
                        top: currentY + 'px',
                        bottom: 'auto',
                        right: 'auto'
                    });
                }
            });

            $(document).on('mouseup', function() {
                isDragging = false;
                $character.css('cursor', 'grab');
            });

            // Touch events
            $character.on('touchstart', function(e) {
                isDragging = true;
                const touch = e.originalEvent.touches[0];
                initialX = touch.clientX - currentX;
                initialY = touch.clientY - currentY;
                e.preventDefault();
            });

            $(document).on('touchmove', function(e) {
                if (isDragging) {
                    const touch = e.originalEvent.touches[0];
                    currentX = touch.clientX - initialX;
                    currentY = touch.clientY - initialY;
                    $character.css({
                        left: currentX + 'px',
                        top: currentY + 'px',
                        bottom: 'auto',
                        right: 'auto'
                    });
                }
            });

            $(document).on('touchend', function() {
                isDragging = false;
            });

            // Initialize position
            currentX = $character.position().left;
            currentY = $character.position().top;
        });
    }

    $('#prev-page').prop('disabled', true);
    $('#next-page').on('click', function() {
        if (currentPage < totalPages) {
            $(`#page-${currentPage}`).hide();
            currentPage++;
            $(`#page-${currentPage}`).show().css('transform', 'rotateY(0deg)');
            $('#prev-page').prop('disabled', false);
            if (currentPage === totalPages) $('#next-page').prop('disabled', true);
            animateCaptions(currentPage);
        }
    });
    $('#prev-page').on('click', function() {
        if (currentPage > 1) {
            $(`#page-${currentPage}`).hide();
            currentPage--;
            $(`#page-${currentPage}`).show().css('transform', 'rotateY(0deg)');
            $('#next-page').prop('disabled', false);
            if (currentPage === 1) $('#prev-page').prop('disabled', true);
            animateCaptions(currentPage);
        }
    });

    // Image modal handler
    $('.album-img').on('click', function() {
        const src = $(this).data('src');
        $('#modal-image').attr('src', src);
    });
});

function start() {
    let splash = document.getElementById("splash");
    if (splash) {
        splash.addEventListener("transitionend", () => {
            const audio = document.getElementById("birthday-song");
            if (audio) {
                audio.play().catch(error => {
                    console.log('Splash audio play failed:', error);
                });
            }
            splash.remove();
        });
        splash.classList.add("hide");
    }
}


