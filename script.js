'use strict';

(function () {
    
    const cardClassList = ['card-container', 'card-back'];
    const cardActiveClass = {
        flipped: 'flipp',
        true: 'true',
        false: 'false',
        success: 'same',
        fail: 'different',
        front: 'card-front',
        inner: 'card-content'
    };
    const cardNumber = 20;
    let flippedCard = [];

    window.gameInit = function (id) {
        const gameInterface = document.getElementById(id);
        randomOrder(gameInterface);
        gameInterface.addEventListener('click', (event) => {
            let target = event.target;

            if (cardClassList.find(className => {
                return target.classList.contains(className) && 
                !target.classList.contains(cardActiveClass.flipped);
            })) {

                reverseToBack(document.querySelectorAll('.' + cardActiveClass.false));
                if (!target.classList.contains(cardClassList[0])) {
                    reverseToFront(target.parentElement);
                }
                else {
                    reverseToFront(target);
                }
            }

            if (Array.from(flippedCard).length % 2 === 0) {
                let result = isTheSame(flippedCard);
                if (result) {
                    isAllCardSame(gameInterface);
                }
            }
        })
    }

    function reverseToFront (element) {
        element.classList.add(cardActiveClass.flipped);
        flippedCard = document.querySelectorAll('.' + cardActiveClass.flipped);
        if (Array.from(flippedCard).length === 1) {
            timerInit();
        }
    }

    function reverseToBack (elements) {
        for (let element of elements) {
            element.classList.remove(cardActiveClass.flipped, cardActiveClass.false);
            element.querySelector('.' + cardActiveClass.front).classList
                .remove(cardActiveClass.fail);
        }
    }

    function isTheSame (cards) {
        let uncheckedCard = Array.from(cards)
            .filter(card => !card.classList.contains(cardActiveClass.false) && 
                !card.classList.contains(cardActiveClass.true));
        if (uncheckedCard[0].querySelector('.' + cardActiveClass.inner).innerHTML.trim() == 
            uncheckedCard[1].querySelector('.' + cardActiveClass.inner).innerHTML.trim()) {

            for (let card of uncheckedCard) {
                card.classList.add(cardActiveClass.true);
                card.querySelector('.' + cardActiveClass.front).classList
                    .add(cardActiveClass.success);
            }
            return true;
        }
        else {
            for (let card of uncheckedCard) {
                card.classList.add(cardActiveClass.false);
                card.querySelector('.' + cardActiveClass.front).classList
                    .add(cardActiveClass.fail);
            }
            return false;
        }
    }

    function isAllCardSame (container) {
        let allCard = container.querySelectorAll('.' + cardActiveClass.success);
        if (Array.from(allCard).length === cardNumber) {
            return true;
        }
        else {
            return false;
        }
    }

    function displayPopUp (id) {
        const popUp = document.getElementById(id);
        popUp.setAttribute('style','display: block;');
        popUp.addEventListener('click', (event) => {
            let target = event.target;
            if (target.classList.contains('off_modal')) {
                event.currentTarget.removeAttribute('style');
                tryAgain('game-interface');
            }
        });
    }

    function tryAgain (id) {
        const gameInterface = document.getElementById(id);
        let callback = function () {
            return randomOrder(gameInterface);
        }
        resetCard(callback());
    }

    function randomOrder(cardsContainer) {
        const gridColumn = 5;
        let cardsCollection = Array.from(cardsContainer.childNodes).filter(function(card){
            if(card.classList == "flipper") {
                return card;
            }
        });
        cardsCollection = shuffle(cardsCollection);
        for(let i = 0; i < cardsCollection.length; i++) {
            cardsCollection[i].setAttribute('style',
            `grid-column-start: ${i+1}; grid-column-end: ${i+2};`);
            if(i < gridColumn) {
                cardsCollection[i].setAttribute('style',
                `grid-row-start: ${1}; grid-row-end: ${1};`);
            }
            else if(i < gridColumn*2) {
                cardsCollection[i].setAttribute('style',
                `grid-row-start: ${2}; grid-row-end: ${2};`);
            }
            else if(i < gridColumn*3) {
                cardsCollection[i].setAttribute('style',
                `grid-row-start: ${3}; grid-row-end: ${3};`);
            }
            else if(i < gridColumn*4) {
                cardsCollection[i].setAttribute('style',
                `grid-row-start: ${4}; grid-row-end: ${4};`);
            }
        }
    }
    
    function shuffle(arr){
        var j, temp;
        for(var i = arr.length - 1; i > 0; i--){
            j = Math.floor(Math.random()*(i + 1));
            temp = arr[j];
            arr[j] = arr[i];
            arr[i] = temp;
        }
        return arr;
    }

    function resetCard(callback) {
        let cardField = document.getElementById('game-interface');
        cardField = Array.from(cardField.children).filter((card) => {
            return card.classList.contains("flipper");
        });
        for(let card of cardField) {
            card.querySelector('.card-container').classList.remove('flipp', 'true', 'false');
            card.querySelector('.card-front').classList.remove('different', 'same');
        }
        setTimeout(() => callback(), 300);
    };

    function timerInit() {
        const gameInterface = document.getElementById('game-interface');
        let timer = document.getElementById('timer');
        let time = timer.children[0].innerHTML.trim();
        timer.hidden = false;

        let timerRun = setInterval(function() {
            let result = isAllCardSame(gameInterface);
            if(time == 0) {
                stop(result, timer, timerRun);
                setTimeout(() => { clearInterval(timerRun); timer.hidden = true; });
                return;
            }
            if(time == '01:00') {
                timer.children[0].innerHTML = '00:59';
                time = parseInt(timer.children[0].innerHTML.trim().slice(3));
            }
            else {
                if(typeof time == 'number') {
                    time--;
                    if(result) {
                        stop(result, timer, timerRun);
                        return;
                    }
                    if(time < 10) {
                        timer.children[0].innerHTML = '00:0' + time;
                    } else {
                        timer.children[0].innerHTML = '00:' + time;
                    }
                }
            }
        }, 1000);
    }

    function stop(parametr, timer, timerRun) {
        setTimeout(() => {
            console.log('stop')
            clearInterval(timerRun); 
            timer.hidden = true; 
            timer.children[0].innerHTML = '01:00';
        }, 0);
        if(parametr == true) {
            displayPopUp('win');
            return true;
        }
        else if (parametr == false) {
            displayPopUp('loose');
            return false;
        }
    }
    
}());