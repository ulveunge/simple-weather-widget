import { Application } from "@hotwired/stimulus";

import WeatherWidgetController from "./controllers/weather-widget-controller";

const application = Application.start();
application.register("weather-widget", WeatherWidgetController);
