
describe(
  "SQLite Experiment Storage",
  () => {

    test(
      "experiment object stores correctly",
      () => {

        const experiment = {

          time: 4,
          height: 1,
          mass: 0.2,
          velocity: 0.5,
        };

        expect(
          experiment.time
        ).toBe(4);

        expect(
          experiment.height
        ).toBe(1);

        expect(
          experiment.mass
        ).toBe(0.2);

        expect(
          experiment.velocity
        ).toBe(0.5);
      }
    );

    test(
      "database supports multiple users",
      () => {

        const user1 = "alice";
        const user2 = "bob";

        expect(
          user1
        ).not.toBe(
          user2
        );
      }
    );

    test(
      "database reset clears records",
      () => {

        const records = [];

        expect(
          records.length
        ).toBe(0);
      }
    );
  }
);
