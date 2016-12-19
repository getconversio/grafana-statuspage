# grafana-statuspage
Grafana-StatusPage.io connector

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/getconversio/grafana-statuspage)

Use the above button to create a new Heroku App to connect Grafana and StatusPage. You need to specify a `STATUSPAGE_API_KEY` and `STATUSPAGE_PAGE_ID` config settings in the newly created application.

## How to add a new alert

Use latest version of Grafana that enables the Alerting feature, then create a new Webhook notification. The url should follow this structure:

    https://yourapp.herokuapp.com/grafana/componentId

You'll find `componentId` in your StatusPage.io component url.
