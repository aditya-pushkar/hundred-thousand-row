## Getting Started

First, clone and build the project:
```bash
1. git clone
2. cd hundred-thousand-row
2. npm run build
3. npm run start
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Overview
Our goal is to render 100,000 rows with their respective squares in Next.js, while managing slow API response times and ensuring minimal lag on the frontend.

### Problems Faced
React is very bad at rendering large lists, tabular data, and grids efficiently. This can lead to a laggy and unusable user interface. 

To address these issues, I implemented virtualization, pagination, and batched API requests for fetching the square of integers.


### Backend
We have two API routes. `/api/integer` and `/api/square`

1. To simplify the project, I'm simulating the database query with pagination in the `/api/integer?page=` API. This API takes a page number as a query parameter and returns a set of 500 integers. With a total of 100,000 integers, there are 200 pages in total (100,000 / 500 = 200).


2. The `/api/square` API takes an array of integers and returns the array of squares with their respective integers with a delay of 2 sec per request. For example👇

```js
[{2:4}, {3:9}, {4:16}, {5:25}]
```

### Frontend End
To render large tabular data efficiently, we need to implement **Virtualization**. For this, I used the external library `react-virtuoso`. 

Here's an overview of how the data is rendered on the frontend:

1. We request a new set of integers from `/api/integer`.
2. The array of integers is sent to `/api/square` and we receive the squares with their respective integers.
3. The squares are stored in a `useState` array, and the UI is then rendered.
4. When the user scrolls to the bottom of the table, we automatically request new sets of squares with their respective integers. This process continues until we reach the last integer.


#### Scope of Improvement
1. Instead of using `Promise.all()`, we could use a simple for loop. While this might increase latency, it would be much easier to understand.
2. We can built a custom virtualization component instead of using an external library.
