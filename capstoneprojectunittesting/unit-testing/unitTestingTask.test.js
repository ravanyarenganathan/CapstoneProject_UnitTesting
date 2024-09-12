const unitTestingTask = require("./unitTestingTask");

const getDate = (dateString) => {
    const currentDate = new Date(dateString);
    const offsetInMinutes = currentDate.getTimezoneOffset();
    const offsetInMilliseconds = offsetInMinutes * 60 * 1000;
    return new Date(currentDate.getTime() + offsetInMilliseconds);
};
describe('Module Definition', () => {
    let root, factory, moduleExports;

    beforeEach(() => {
        root = {};
        factory = jest.fn().mockReturnValue({ someProperty: 'someValue' });
        moduleExports = null;
        global.exports = {};
        global.define = undefined;
    });
    test('should set module.exports correctly in CommonJS environment', () => {
        // Remove define from the global object to mimic CommonJS environment
        delete global.define;
        global.exports = module.exports;

        (function (root, factory) {
            if (typeof define === "function" && define.amd) {
                define([], function () {
                    return factory(root);
                });
            } else if (typeof exports === "object") {
                module.exports = factory(root);
            } else {
                root.unitTestingTask = factory(root);
            }
        })(root, factory);

        expect(module.exports).toEqual({ someProperty: 'someValue' });
    });
});

describe("unitTestingTask", () => {
    const OriginalOffset = Date.prototype.getTimezoneOffset;

    beforeAll(() => {
        unitTestingTask.lang("en");
        Date.prototype.getTimezoneOffset = jest.fn(() => 0);
    });

    afterAll(() => {
        Date.prototype.getTimezoneOffset = OriginalOffset;
    });
    describe("language support", () => {
        test("sets and gets the current language", () => {
            expect(unitTestingTask.lang()).toBe("en");
            unitTestingTask.lang("fr", {
                _months:
                    "Janvier_Février_Mars_Avril_Mai_Juin_Juillet_Août_Septembre_Octobre_Novembre_Décembre".split(
                        "_"
                    ),
                months: function (date) {
                    return this._months[date.getMonth()];
                },
                _monthsShort:
                    "Jan_Fév_Mar_Avr_Mai_Jui_Juil_Aoû_Sep_Oct_Nov_Déc".split(
                        "_"
                    ),
                monthsShort: function (date) {
                    return this._monthsShort[date.getMonth()];
                },
                weekdays:
                    "Dimanche_Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi".split(
                        "_"
                    ),
                weekdaysShort: "Dim_Lun_Mar_Mer_Jeu_Ven_Sam".split("_"),
                weekdaysMin: "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
                meridiem: function (hours, isLower) {
                    return hours > 11
                        ? isLower
                            ? "pm"
                            : "PM"
                        : isLower
                        ? "am"
                        : "AM";
                },
            });
            expect(unitTestingTask.lang()).toBe("fr");
            unitTestingTask.lang("en"); 
        });
    });

    describe("tokens", () => {
        const date = getDate("2023-06-07T05:09:03.07Z");

        test("should formats date tokens to return full year", () => {
            expect(unitTestingTask("YYYY", date)).toBe("2023");
        });

        test("should formats date tokens to return short year", () => {
            expect(unitTestingTask("YY", date)).toBe("23");
        });

        test("should formats date tokens to return full month", () => {
            expect(unitTestingTask("MMMM", date)).toBe("June");
        });

        test("should formats date tokens to return short month", () => {
            expect(unitTestingTask("MMM", date)).toBe("Jun");
        });

        test("should formats date tokens to return month in numbers with zero", () => {
            expect(unitTestingTask("MM", date)).toBe("06");
        });

        test("should formats date tokens to return month in numbers without zero", () => {
            expect(unitTestingTask("M", date)).toBe("6");
        });

        test("should formats date tokens to return full day", () => {
            expect(unitTestingTask("DDD", date)).toBe("Wednesday");
        });

        test("should formats date tokens to return short day", () => {
            expect(unitTestingTask("DD", date)).toBe("Wed");
        });

        test("should formats date tokens to return shorter day", () => {
            expect(unitTestingTask("D", date)).toBe("We");
        });

        test("should formats date tokens to return date with zero", () => {
            expect(unitTestingTask("dd", date)).toBe("07");
        });

        test("should formats date tokens to return date without zero", () => {
            expect(unitTestingTask("d", date)).toBe("7");
        });

        test("should formats date tokens to return date without zero", () => {
            expect(unitTestingTask("d", date)).toBe("7");
        });

        test("should formats date tokens to return hour with zero", () => {
            expect(unitTestingTask("HH", date)).toBe("05");
        });

        test("should formats date tokens to return hour without zero", () => {
            expect(unitTestingTask("H", date)).toBe("5");
        });

        test("should formats date tokens to return hour with zero by passing hh", () => {
            expect(unitTestingTask("hh", date)).toBe("05");
        });

        test("should formats date tokens to return hour without zero by passing h", () => {
            expect(unitTestingTask("h", date)).toBe("5");
        });

        test("should formats date tokens to return minutes with zero", () => {
            expect(unitTestingTask("mm", date)).toBe("09");
        });

        test("should formats date tokens to return minutes without zero", () => {
            expect(unitTestingTask("m", date)).toBe("9");
        });

        test("should formats date tokens to return seconds with zero", () => {
            expect(unitTestingTask("ss", date)).toBe("03");
        });

        test("should formats date tokens to return seconds without zero", () => {
            expect(unitTestingTask("s", date)).toBe("3");
        });

        test("should formats date tokens to return milliseconds with zero", () => {
            expect(unitTestingTask("ff", date)).toBe("070");
        });

        test("should formats date tokens to return milliseconds without zero", () => {
            expect(unitTestingTask("f", date)).toBe("70");
        });

        test("should formats date tokens to return time-zone in ISO8601-compatible basic format", () => {
            expect(unitTestingTask("ZZ", date)).toBe("+0000");
        });

        test("should formats date tokens to return time-zone in ISO8601-compatible extended format", () => {
            expect(unitTestingTask("Z", date)).toBe("+00:00");
        });

        test("should formats date tokens to return AM caps", () => {
            expect(unitTestingTask("A", date)).toBe("AM");
        });

        test("should formats date tokens to return am small", () => {
            expect(unitTestingTask("a", date)).toBe("am");
        });

        test("should formats date tokens to return PM caps", () => {
            const updatedDate = "2023-06-17T13:09:03.456Z";
            expect(unitTestingTask("A", updatedDate)).toBe("PM");
        });

        test("should formats date tokens to return pm small", () => {
            const updatedDate = "2023-06-17T13:09:03.456Z";
            expect(unitTestingTask("a", updatedDate)).toBe("pm");
        });

        test("returns original string if no matching token", () => {
            const format = "No Token";
            const date = "2023-06-17T05:09:03.456Z";
            expect(unitTestingTask(format, date)).toBe(format);
        });

        test("should handles unix timestamp date inputs", () => {
            expect(unitTestingTask("YYYY", 1686997743456)).toBe("2023"); 
        });

        test("ahould handles ISO date string inputs", () => {
            expect(unitTestingTask("YYYY", "2023-06-17T05:09:03.456Z")).toBe(
                "2023"
            ); 
        });
    });

    describe("custom formats", () => {
        const date = getDate("2023-06-17T15:24:30.456Z");

        test("registers and formats custom formats", () => {
            unitTestingTask.register("customFormat", "YYYY/MM/dd");
            expect(unitTestingTask("customFormat", date)).toBe("2023/06/17");
        });

        test("should formats predefined ISO formats date", () => {
            expect(unitTestingTask("ISODate", date)).toBe("2023-06-17");
        });

        test("should formats predefined ISO formats time", () => {
            expect(unitTestingTask("ISOTime", date)).toBe("03:24:30");
        });

        test("should formats predefined ISO formats date time", () => {
            expect(unitTestingTask("ISODateTime", date)).toBe(
                "2023-06-17T03:24:30"
            );
        });

        test("should formats predefined ISO formats date time with zone", () => {
            expect(unitTestingTask("ISODateTimeTZ", date)).toBe(
                "2023-06-17T03:24:30+00:00"
            );
        });
    });

    describe("error handling", () => {
        test("throws TypeError if format is not a string", () => {
            expect(() => unitTestingTask(123)).toThrow(TypeError);
        });

        test("throws TypeError if date is not a valid type", () => {
            expect(() => unitTestingTask("YYYY", {})).toThrow(TypeError);
        });
    });

   
});
