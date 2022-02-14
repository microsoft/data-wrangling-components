**impute** fills in any invalid values with a specified value. Invalid values include NaN, null, and undefined.

Example

| id  | name  |
| --- | ----- |
| 1   | Bob   |
| 2   | Joe   |
| 3   | null  |
| 4   | Jenny |
| 5   | null  |

`impute column['name'] with value='Doe'`:

| id  | name  |
| --- | ----- |
| 1   | Bob   |
| 2   | Joe   |
| 3   | Doe   |
| 4   | Jenny |
| 5   | Doe   |
