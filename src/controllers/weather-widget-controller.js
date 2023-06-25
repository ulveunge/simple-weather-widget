import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static values = { url: String };
  static targets = [
    "weather",
    "error",
    "spinner",
    "query",
    "img",
    "temp",
    "type",
    "wind",
    "humidity",
    "feelslike",
  ];

  apiKey = "e67afff5c8d949a4a36193351232406";

  conditions = [
    "clear",
    "cloudy",
    "flurries",
    "fog",
    "hazy",
    "lightflurries",
    "lightrain",
    "lightsleet",
    "lightsnow",
    "lighttstorms",
    "mist",
    "mostlycloudy",
    "mostlysunny",
    "partlycloudy",
    "partlysunny",
    "rain",
    "sleet",
    "snow",
    "sunny",
    "tstorms",
  ];

  async connect() {
    try {
      this.queryTarget.value = "London";
      await this.load();
      this.showSpinner(false);
      this.changeContent();
    } catch (err) {
      this.showErrorMessage(true, err.message);
    }
  }

  async getWeather(e) {
    try {
      if (e.key !== "Enter") return;
      await this.load();
      this.showSpinner(false);
      this.changeContent();
    } catch (err) {
      this.showErrorMessage(true, err.message);
    }
  }

  async load() {
    try {
      this.showSpinner(true);

      const request = await fetch(
        `${this.urlValue}?key=${this.apiKey}&q=${this.queryTarget.value}`
      );
      const data = await request.json();

      if (data.error)
        throw new Error(
          `Something went wrong (${data.error.code}). ${data.error.message}`
        );

      this.weather = data.current;
    } catch (err) {
      this.showSpinner(false);
      throw err;
    }
  }

  changeContent() {
    this.tempTarget.textContent = Math.round(this.weather.temp_c);
    this.typeTarget.textContent = this.weather.condition.text;
    this.windTarget.textContent = this.weather.wind_kph;
    this.humidityTarget.textContent = this.weather.humidity;
    this.feelslikeTarget.textContent = Math.round(this.weather.feelslike_c);
    this.imgTarget.src = this.getImgUrl();
  }

  showSpinner(val) {
    if (val) this.errorTarget.style.display = "none";

    this.spinnerTarget.style.display = val ? "flex" : "none";
    this.weatherTarget.style.display = val ? "none" : "flex";
  }

  showErrorMessage(val, errMessage) {
    this.errorTarget.style.display = val ? "initial" : "none";
    this.weatherTarget.style.display = "none";

    if (errMessage) this.errorTarget.textContent = errMessage;
  }

  getImgUrl() {
    const condition = this.conditions.includes(
      this.weather.condition.text.replaceAll(" ", "").toLowerCase()
    )
      ? this.weather.condition.text.replaceAll(" ", "").toLowerCase()
      : "default";

    return `img/${
      this.weather.is_day ? "daytime" : "nighttime"
    }/${condition}.svg`;
  }
}
