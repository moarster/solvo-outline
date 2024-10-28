import * as React from "react";
import { RouteComponentProps, Switch } from "react-router-dom";
import Route from "~/components/ProfiledRoute";
import useSettingsConfig from "~/hooks/useSettingsConfig";
import DocumentNew from "~/scenes/DocumentNew";
import Error404 from "~/scenes/Error404";
import lazy from "~/utils/lazyWithRetry";
import { matchDocumentSlug, settingsPath } from "~/utils/routeHelpers";

const Document = lazy(() => import("~/scenes/Document"));

export default function SettingsRoutes() {
  const configs = useSettingsConfig();

  return (
    <Switch>
      {configs.map((config) => (
        <Route
          exact
          key={config.path}
          path={config.path}
          component={config.component}
        />
      ))}
      <Route
        exact
        path={`${settingsPath("templates")}/${matchDocumentSlug}`}
        component={Document}
      />
      <Route
        exact
        path={`${settingsPath("templates")}/new`}
        component={(props: RouteComponentProps) => (
          <DocumentNew {...props} template />
        )}
      />
      <Route component={Error404} />
    </Switch>
  );
}
