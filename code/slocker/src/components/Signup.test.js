import { Signup } from "./Signup";

test("in render signin button is disabled", () => {
  render(<Signup />);
  screen.debug();
});
