$("input[type=tel]").mask("+375 (99) 999-99-99"); //автозаполнение input-ов-телефонов
$(".swipe-left").on("click", function () {
  //слайдер влево
  let mainView = document.querySelector(".production-view");
  let previews = document.querySelectorAll(".production-preview");
  let temp;
  let firstSrc = previews[0].src;
  for (let i = 0; i < previews.length - 1; i++) {
    temp = previews[i].src;
    previews[i].src = previews[i + 1].src;
    previews[i + 1] = temp.src;
  }
  previews[previews.length - 1].src = firstSrc;
  mainView.src = previews[1].src;
});
$(".swipe-right").on("click", function () {
  //слайдер вправо
  let mainView = document.querySelector(".production-view");
  let previews = document.querySelectorAll(".production-preview");
  let temp;
  let lastSrc = previews[previews.length - 1].src;
  for (let i = previews.length - 1; i > 0; i--) {
    temp = previews[i].src;
    previews[i].src = previews[i - 1].src;
    previews[i - 1] = temp.src;
  }
  previews[0].src = lastSrc;
  mainView.src = previews[1].src;
});
$("#show-more").on("click", function () {
  //показать еще столько же
  let allProducts = document.querySelectorAll(".product");
  let allActiveProducts = document.querySelectorAll(".product.active");
  let hideButton = false;
  let activeProductsAmount = allActiveProducts.length;
  for (let i = activeProductsAmount - 1; i < (activeProductsAmount*2); i++) {
    if (allProducts[i] === undefined) {
      hideButton = true;
      break;
    } else {
      allProducts[i].classList.add("active");
    }
  }
  if (hideButton) {
    this.classList.add("hidden");
  }
});
$(".next-button").on("click", function () {
  //переключение теста вперед

  let allQuestions = document.querySelectorAll(".quiz-question");
  let currentActiveQuestion = document.querySelector(".quiz-question.active");
  let questionIndex;
  for (let i = 0; i < allQuestions.length; i++) {
    if (allQuestions[i].isEqualNode(currentActiveQuestion)) {
      questionIndex = i;
    }
  }
  document.querySelector(".prev-button").classList.remove("hidden");
  if (questionIndex !== allQuestions.length-1) {
    currentActiveQuestion.classList.remove("active");
    allQuestions[questionIndex + 1].classList.add("active");
    for(let i=0;i<=questionIndex + 1;i++){
      allQuestions[questionIndex + 1].children[0].children[0].children[1].children[i].classList.add('passed');
    }
    
    //переключили на новый вопрос и добавили пройденный progress-stage
  }
});
$(".prev-button").on("click", function () {
  //переключение теста назад

  let allQuestions = document.querySelectorAll(".quiz-question");
  let currentActiveQuestion = document.querySelector(".quiz-question.active");
  let questionIndex;
  for (let i = 0; i < allQuestions.length; i++) {
    if (allQuestions[i].isEqualNode(currentActiveQuestion)) {
      questionIndex = i;
    }
  }
  if (questionIndex === 1) {
    document.querySelector(".prev-button").classList.add("hidden");
  }

  currentActiveQuestion.classList.remove("active");
  allQuestions[questionIndex - 1].classList.add("active");
});
window.onload=function(){
  let allQuestions = document.querySelectorAll(".quiz-progress");
  let progressStagesHTML="";
  let questionsNumber=allQuestions.length;
  for(let i=0;i<questionsNumber;i++){
    progressStagesHTML+='<hr class="progress-stage">';
  }
  for(let i=0;i<questionsNumber;i++){
    allQuestions[i].innerHTML=` <p class="progress-label">Вопрос ${i+1} из ${questionsNumber}</p>
    
    <div class="progress-container">
        ${progressStagesHTML}
    </div>`;
  }

  let allProgressContainers = document.querySelectorAll(".progress-container");
  for(let i=0;i<allProgressContainers.length;i++){
    allProgressContainers[i].children[0].classList.add("passed");
  }

  let allQuizez = document.querySelectorAll(".quiz-question");
  allQuizez[0].classList.add("active");//показываем первый вопрос
  
}