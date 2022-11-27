const slideIdNumbers = [1, 2, 3, 4, 5, 6];
const sliderIds = [];
slideIdNumbers.forEach((e) => {
  sliderIds.push(`slide${e}`);
});
let counter = 0;
setInterval(() => {
  const currentSlide = document.getElementById(sliderIds[counter]);
  currentSlide.checked = true;
//  console.log(currentSlide);
  counter++;
  counter = counter % 6;
//  console.log(counter);
}, 4000);