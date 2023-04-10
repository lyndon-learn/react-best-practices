import { act } from "@testing-library/react";
import { setup } from "./index";

jest.mock("@utils/history", () => jest.requireActual("react-router-dom"));

describe("useUrlState", () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("state should be url search params", () => {
    const res = setup([
      {
        pathname: "/index",
        search: "?count=1",
      },
    ]);
    expect(res.state).toMatchObject({ count: "1" });
  });

  it("url should be changed when use setState", () => {
    const res = setup(["/index"]);
    expect(res.state).toMatchObject({});
    act(() => {
      res.setState({ count: 1 });
    });
    expect(res.state).toMatchObject({ count: "1" });
  });

  it("multiple states should work", () => {
    const res = setup(["/index"]);
    act(() => {
      res.setState({ page: 1 });
    });
    act(() => {
      res.setState({ pageSize: 10 });
    });
    expect(res.state).toMatchObject({ page: "1", pageSize: "10" });
  });

  it("query-string options should work", async () => {
    const res = setup(
      [
        {
          pathname: "/index",
          search: "?foo=1,2,3",
        },
      ],
      {},
      {
        parseOptions: {
          arrayFormat: "comma",
        },
        stringifyOptions: {
          arrayFormat: "comma",
        },
      }
    );
    expect(res.state).toMatchObject({ foo: ["1", "2", "3"] });

    act(() => {
      res.setState({ foo: ["4", "5", "6"] });
    });
    expect(res.state).toMatchObject({ foo: ["4", "5", "6"] });
  });
});
