const Today = document.querySelector("#today");
Today.addEventListener("click", () => {
  document.querySelector("#date-day").innerHTML = "Today";
});

const AllList = document.querySelector("#AllList");
AllList.addEventListener("click", () => {
  document.querySelector("#date-day").innerHTML = "All List";
});

const Upcomming = document.querySelector("#Upcomming");
Upcomming.addEventListener("click", () => {
  document.querySelector("#date-day").innerHTML = "Upcomming";
});
