# convert

Converts the data of a column from one type to another. This is normally used for converting string data to a strict type such as a date or number. Cell values that do not properly parse to the specified type will be set to empty/NaN in the output.

## Data types

- Boolean - converts strings to true/false booleans. The text 'false' will turn to `false`, along with any other empty/NaN/undefined values. Any valid string other than 'false' will become `true`.
- Date - converts a date string. This can be tricky across browsers, we recommend formatting your date strings as [ISO8601](https://en.wikipedia.org/wiki/ISO_8601) for predictable conversions.
- Decimal - parses a string into a decimal (floating-point) number.
- Integer - parses a string into an integer (whole) number. This will auto-parse strings such as hexadecimal unless a specific radix (base) is provided.


## Example

| age      |
| -------- |
| '10'     |
| '22'     |
| 'thirty' |

`convert columns['age'], type=int`:

| age |
| --- |
| 10  |
| 22  |
| NaN |
