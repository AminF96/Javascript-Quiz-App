// everything related to Quiz App 
class Quiz {
    constructor(quastions) {
        this._quastions = quastions;
        this._currentQuastionIndex = 0;
        this._wrapper = document.querySelector('#app-wrapper');
        this._startBtn = document.querySelector('#start-quiz');


        // eventListeners
        
        // when click happens on start quize button
        this._startBtn.addEventListener('click', this._updateQuizContent.bind(this));

        // when click happens on the app wrapper
        this._wrapper.addEventListener('click', e => {
            e.preventDefault();

            const {
                target
            } = e;

            // if click happens on quastion's options
            if (target.classList.contains('option')) {
                this._validateCorrectnessOfAnswer(target.id);

                // if all quastions were answered, create show result button in last quastion 
                this._createBodyButtons();
            }

            // if click happens on next quastion's button
            if (target.id == 'next') {
                this._currentQuastionIndex++;
                this._updateQuizContent();
            }

            // if click happens on previous quastion's button
            if (target.id == 'prev') {
                this._currentQuastionIndex--;
                this._updateQuizContent();
            }

            // if click happens on show quiz result button
            if (target.id == 'show-result') {
                this._showQuizResult();
            }
        });
    }

    _updateQuizContent() {
        // hide start quize Button
        this._hideElement(this._startBtn);

        // if quiz app wrapper exists, remove it
        if (this._quizWrapper) {
            this._quizWrapper.remove();
        }

        // create quiz wrapper
        this._createAndAppendElem('div', this._wrapper, 'shadow bg-white pt-4 px-4 pb-1 rounded', 'quiz-wrapper');
        this._quizWrapper = document.getElementById('quiz-wrapper');

        // update quiz header
        this._updateHeader();

        // update quiz body
        this._updateBody();

        // update Performance result circles
        this._updateFooter();
    }

    _updateHeader() {
        let headerDiv = this._getEmptyOfElemInQuizWrapper('header')

        // create header element content for show current quastion's number 
        const headerContent = `سوال
        <span id="current-num">${this._currentQuastionIndex + 1}</span>
        از
        <span id="total-num">${this._quastions.length}</span>`;
        this._createAndAppendElem('h3', headerDiv, '', '', headerContent);
    }

    _updateBody() {
        this._bodyDiv = this._getEmptyOfElemInQuizWrapper('body');
        this._bodyDiv.classList.add('py-3');

        // create quastion options and append them to body
        this._createQuastionAndOptions();

        // create next and prev buttons and append them to body
        this._createBodyButtons();
    }

    _updateFooter() {
        const footerDiv = this._getEmptyOfElemInQuizWrapper('footer');
        footerDiv.classList.add('pt-2');

        // create circles
        let circles = '';
        this._quastions.map(
            q => {
                if (!q.clientAnswer) { // if the question has not been answered yet
                    circles += '<li><i class="fas fa-circle"></i></li>';
                } else if (q.clientAnswer == q.correctAnswer) { // if the quastion has been answered correctly
                    circles += '<li><i class="fas fa-check-circle"></i></li>';
                } else { // if the quastion has been answered incorrectly
                    circles += '<li><i class="fas fa-times-circle"></i></li>';
                }
            }
        );

        // append circles to footer
        this._createAndAppendElem('ul', footerDiv, '', '', circles);
    }

    _createQuastionAndOptions() {
        const currentQuastion = this._quastions[this._currentQuastionIndex];

        const options = `
            <li id="quastion">${currentQuastion.quastion}</li>
            <li id="a" class="option">${currentQuastion.a}</li>
            <li id="b" class="option">${currentQuastion.b}</li>
            <li id="c" class="option">${currentQuastion.c}</li>
            <li id="d" class="option">${currentQuastion.d}</li>
        `;

        this._createAndAppendElem('ul', this._bodyDiv, '', '', options);

        // check if the current question has been answered bfore
        if (currentQuastion.clientAnswer != null) {
            this._updateQuastionOptions(currentQuastion);
        }
    }

    _createBodyButtons() {
        let btnsWrapperContent;

        // if it was first quastion
        if (this._currentQuastionIndex == 0) {
            btnsWrapperContent = `
                <button id="next" class="btn position-absolute">سوال بعدی</button>
            `;
        } else if (this._currentQuastionIndex == this._quastions.length - 1) { // if it was last quastion
            btnsWrapperContent = `
                <button id="prev" class="btn position-absolute">سوال قبلی</button>
            `;

            // If there were no unanswered questions remain
            if (!this._isThereUnansweredQuestion()) {
                btnsWrapperContent += '<button id="show-result" class="btn position-absolute">مشاهده عملکرد</button>';
            }

        } else {
            btnsWrapperContent = `
                <button id="prev" class="btn position-absolute">سوال قبلی</button>
                <button id="next" class="btn position-absolute">سوال بعدی</button>
            `;

        }

        // if buttons wrapper element exists, remove it
        if (document.querySelector('.btn-container')) {
            document.querySelector('.btn-container').remove();
        }

        this._createAndAppendElem('div', this._bodyDiv, 'btn-container position-relative', '', btnsWrapperContent);
    }

    _isThereUnansweredQuestion() {
        let result = this._quastions.some(q => !q.clientAnswer);

        return result;
    }

    _showQuizResult() {
        const statistics = this._getPerformanceStatistics();

        // show result statistics 
        this._createResult(statistics);
    }

    _getPerformanceStatistics() {
        let correctNum = 0;
        let wrongNum = 0;
        let totalNum = this._quastions.length;
        this._quastions.map(
            q => {
                q.correctAnswer == q.clientAnswer ? correctNum++ : wrongNum++;
            }
        );
        let CorrectPercentage = Math.floor((correctNum * 100) / totalNum);

        return {
            totalNum,
            correctNum,
            wrongNum,
            CorrectPercentage
        }
    }

    _createResult(info) {
        // remove quiz wrapper from page
        this._quizWrapper.remove();

        // append result wrapper to page
        const resultContent = `
        <div class="header mb-3">
            <h2 class="text-center">
                نتیجه آزمون
            </h2>
        </div>
        <div class="result-body">
            <table class="table table-bordered text-dark text-center">
                <tbody>
                    <tr scope="row">
                        <td class="result-title">تعداد سوالات</td>
                    <td>${info.totalNum}</td>
                    </tr>
                    <tr scope="row">
                        <td class="result-title">تعداد پاسخ صحیح</td>
                    <td>${info.correctNum}</td>
                    </tr>
                    <tr scope="row">
                        <td class="result-title">تعداد پاسخ اشتباه</td>
                    <td>${info.wrongNum}</td>
                    </tr>
                    <tr scope="row">
                        <td class="result-title">درصد درستی عمکرد</td>
                    <td>${info.CorrectPercentage}%</td>
                    </tr>
                </tbody>
            </table>
        </div>
        `;

        this._createAndAppendElem('div', this._wrapper, 'shadow bg-white py-4 px-4 rounded', 'result-wrapper', resultContent);
    }

    _getEmptyOfElemInQuizWrapper(elemClassName) {
        let elem = this._quizWrapper.querySelector(`.${elemClassName}`);

        // check if element is not exists yet
        if (!elem) {
            // create element and append it to quiz wrapper
            this._createAndAppendElem('div', this._quizWrapper, elemClassName);
            elem = this._quizWrapper.querySelector(`.${elemClassName}`);
        }
        // empty element
        this._emptyElem(elem);

        return elem;
    }

    _validateCorrectnessOfAnswer(clientAnswer) {
        const currentQuastion = this._quastions[this._currentQuastionIndex];

        // update current quastion's object
        currentQuastion.clientAnswer = clientAnswer;

        // update options based on client's answer that updates current quastion's object
        this._updateQuastionOptions(currentQuastion);

        // update Performance result circles
        this._updateFooter();
    }

    _updateQuastionOptions(quastion) {
        // show the correct option
        document.querySelector(`#${quastion.correctAnswer}`).classList.add('true');

        // if client's answer was wrong
        if (quastion.correctAnswer != quastion.clientAnswer) {
            document.querySelector(`#${quastion.clientAnswer}`).classList.add('wrong');
        }

        // disable options
        document.querySelectorAll('.option').forEach(li => {
            li.classList.add('disabled');
        });
    }

    _hideElement(elm) {
        elm.classList.add('d-none');
    }

    _createAndAppendElem(elemName, wrapper, className = '', idName = '', innerHTML = '') {
        const elem = document.createElement(elemName);
        elem.className = className;
        elem.id = idName;
        elem.innerHTML = innerHTML;

        wrapper.appendChild(elem);
    }

    _emptyElem(elem) {
        elem.innerHTML = '';
    }
}