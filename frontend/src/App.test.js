import { render, screen } from "@testing-library/react";
import React from "react";
import App from "./App";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { store } from "./app/store";
import { Provider } from "react-redux";

test("renders main navigation menu", () => {
  render(
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </Router>
    </Provider>
  );
  const linkElement = screen.getByText(/Discover/i);
  expect(linkElement).toBeInTheDocument();
});
