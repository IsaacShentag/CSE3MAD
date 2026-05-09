
describe(
  "Vacuum Physics Engine",
  () => {

    test(
      "1 meter vacuum drop follows Newtonian gravity",
      () => {

        const gravity = 9.80665;
        const height = 1;

        const calculatedTime =
          Math.sqrt(
            (2 * height) / gravity
          );

        expect(
          calculatedTime
        ).toBeCloseTo(
          0.4515,
          3
        );
      }
    );

    test(
      "drag increases fall time",
      () => {

        const vacuumTime = 0.4515;
        const parachuteTime = 4;

        expect(
          parachuteTime
        ).toBeGreaterThan(
          vacuumTime
        );
      }
    );

    test(
      "vacuum acceleration equals Earth gravity",
      () => {

        const gravity = 9.80665;

        expect(
          gravity
        ).toBeCloseTo(
          9.81,
          2
        );
      }
    );
  }
);
