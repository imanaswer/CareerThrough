import type { Skill, Question, SkillPlan } from "../taxonomy";

export const skills: Skill[] = [
  {
    id: "sql",
    name: "SQL",
    dimension: "technical",
    description:
      "Can write correct queries to filter, aggregate, join and rank data in a relational database without supervision.",
    topics: [
      { id: "sql-filtering", name: "Selecting & Filtering" },
      { id: "sql-aggregation", name: "Aggregation & GROUP BY" },
      { id: "sql-joins", name: "Joins" },
      { id: "sql-subqueries-windows", name: "Subqueries & Window Functions" },
    ],
  },
  {
    id: "python",
    name: "Python for Data",
    dimension: "technical",
    description:
      "Can use Python with NumPy and pandas to load, slice, summarise and combine datasets for routine analysis tasks.",
    topics: [
      { id: "python-basics", name: "Core Python & Data Structures" },
      { id: "python-numpy", name: "NumPy & Vectorization" },
      { id: "python-pandas-selection", name: "pandas: Selecting & Filtering" },
      { id: "python-pandas-groupby-merge", name: "pandas: Grouping & Merging" },
    ],
  },
  {
    id: "excel",
    name: "Excel & Spreadsheets",
    dimension: "technical",
    description:
      "Can build reliable spreadsheets using correct references, conditional and lookup formulas, and PivotTables to answer business questions.",
    topics: [
      { id: "excel-references", name: "Formulas & Cell References" },
      { id: "excel-conditional", name: "Conditional Functions" },
      { id: "excel-lookups", name: "Lookup Functions" },
      { id: "excel-pivot-tables", name: "PivotTables" },
    ],
  },
  {
    id: "statistics",
    name: "Statistics",
    dimension: "technical",
    description:
      "Can summarise data, reason about probability and uncertainty, and interpret tests and regressions without drawing false conclusions.",
    topics: [
      { id: "statistics-descriptive", name: "Descriptive Statistics" },
      { id: "statistics-probability", name: "Probability & Distributions" },
      { id: "statistics-inference", name: "Sampling & Hypothesis Testing" },
      { id: "statistics-correlation-regression", name: "Correlation & Regression" },
    ],
  },
  {
    id: "data-viz",
    name: "Data Visualization",
    dimension: "technical",
    description:
      "Can choose the right chart, design it honestly and clearly, and present dashboards and findings that a business audience can act on.",
    topics: [
      { id: "data-viz-chart-selection", name: "Choosing the Right Chart" },
      { id: "data-viz-design-principles", name: "Design & Perception Principles" },
      { id: "data-viz-dashboards", name: "Dashboards & KPIs" },
      { id: "data-viz-storytelling", name: "Storytelling with Data" },
    ],
  },
  {
    id: "data-cleaning",
    name: "Data Cleaning",
    dimension: "technical",
    description:
      "Can turn messy raw data into a trustworthy dataset by fixing types, missing values, duplicates and outliers, and proving nothing was lost.",
    topics: [
      { id: "data-cleaning-types-formats", name: "Data Types & Formats" },
      { id: "data-cleaning-missing-values", name: "Missing Values" },
      { id: "data-cleaning-duplicates-consistency", name: "Duplicates & Inconsistent Values" },
      { id: "data-cleaning-outliers-validation", name: "Outliers & Validation" },
    ],
  },
];

export const questions: Question[] = [
  // ---------- SQL ----------
  {
    id: "sql-q1",
    skillId: "sql",
    topicId: "sql-filtering",
    prompt: `The employees table has 50 rows; 5 of them have manager_id set to NULL. What does this query return?\n\nSELECT * FROM employees WHERE manager_id = NULL;`,
    options: [
      "No rows, because comparing anything to NULL with = is never true",
      "The 5 rows where manager_id is NULL",
      "The 45 rows where manager_id is not NULL",
      "A syntax error, because NULL cannot appear in a WHERE clause",
    ],
    answer: 0,
    explanation:
      "Any comparison with NULL using = evaluates to UNKNOWN, so no row passes the filter. You must write WHERE manager_id IS NULL.",
  },
  {
    id: "sql-q2",
    skillId: "sql",
    topicId: "sql-filtering",
    prompt:
      "You need orders from 2024 whose status is either 'shipped' or 'delivered'. The orders table has columns order_year and status. Which WHERE clause is correct?",
    options: [
      "WHERE order_year = 2024 AND status = 'shipped' OR status = 'delivered'",
      "WHERE order_year = 2024 AND status IN ('shipped', 'delivered')",
      "WHERE order_year = 2024 OR status IN ('shipped', 'delivered')",
      "WHERE order_year = 2024 AND status = 'shipped' AND status = 'delivered'",
    ],
    answer: 1,
    explanation:
      "IN keeps both statuses tied to the year filter. The first option is wrong because AND binds tighter than OR, so it also returns delivered orders from every year.",
  },
  {
    id: "sql-q3",
    skillId: "sql",
    topicId: "sql-aggregation",
    prompt: `The payments table has 4 rows with amount values 100, NULL, 200 and 300. What does this query return?\n\nSELECT COUNT(*), COUNT(amount), AVG(amount) FROM payments;`,
    options: ["4, 4, 150", "3, 3, 200", "4, 3, 200", "4, 3, 150"],
    answer: 2,
    explanation:
      "COUNT(*) counts all rows (4), while COUNT(amount) and AVG(amount) ignore NULLs, giving 3 and 600 / 3 = 200.",
  },
  {
    id: "sql-q4",
    skillId: "sql",
    topicId: "sql-aggregation",
    prompt: "Which query correctly lists customers who have placed more than 5 orders?",
    options: [
      "SELECT customer_id, COUNT(*) FROM orders WHERE COUNT(*) > 5 GROUP BY customer_id;",
      "SELECT customer_id, COUNT(*) FROM orders GROUP BY customer_id WHERE COUNT(*) > 5;",
      "SELECT customer_id, COUNT(*) > 5 FROM orders;",
      "SELECT customer_id, COUNT(*) FROM orders GROUP BY customer_id HAVING COUNT(*) > 5;",
    ],
    answer: 3,
    explanation:
      "WHERE filters rows before grouping and cannot contain aggregates. Conditions on aggregated values belong in HAVING, which comes after GROUP BY.",
  },
  {
    id: "sql-q5",
    skillId: "sql",
    topicId: "sql-joins",
    prompt: `customers has 3 rows: A, B and C. In orders, customer A has 2 orders, B has 1 order and C has none. How many rows does this return?\n\nSELECT c.name, o.id\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id;`,
    options: ["2", "3", "4", "6"],
    answer: 2,
    explanation:
      "A LEFT JOIN returns one row per match (2 for A, 1 for B) plus one row for C with NULL order columns, for 4 rows in total.",
  },
  {
    id: "sql-q6",
    skillId: "sql",
    topicId: "sql-joins",
    prompt: "Which query returns customers who have never placed an order?",
    options: [
      "SELECT c.* FROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL;",
      "SELECT c.* FROM customers c INNER JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL;",
      "SELECT c.* FROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.customer_id = NULL;",
      "SELECT c.* FROM customers c RIGHT JOIN orders o ON o.customer_id = c.id WHERE c.id IS NULL;",
    ],
    answer: 0,
    explanation:
      "The LEFT JOIN keeps every customer, and unmatched customers get NULL order columns, so filtering on o.id IS NULL isolates them. An INNER JOIN drops those customers before the filter runs.",
  },
  {
    id: "sql-q7",
    skillId: "sql",
    topicId: "sql-subqueries-windows",
    prompt: `The results table has three rows: Asha 90, Ben 90, Chen 80. What are the two values returned for Chen?\n\nSELECT name,\n  RANK() OVER (ORDER BY score DESC) AS r,\n  DENSE_RANK() OVER (ORDER BY score DESC) AS dr\nFROM results;`,
    options: ["r = 2, dr = 2", "r = 3, dr = 3", "r = 2, dr = 3", "r = 3, dr = 2"],
    answer: 3,
    explanation:
      "RANK leaves a gap after ties, so the two 90s are both rank 1 and Chen is rank 3. DENSE_RANK does not skip numbers, so Chen is 2.",
  },
  {
    id: "sql-q8",
    skillId: "sql",
    topicId: "sql-subqueries-windows",
    prompt: "Which query returns employees who earn more than the company-wide average salary?",
    options: [
      "SELECT name FROM employees WHERE salary > AVG(salary);",
      "SELECT name FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);",
      "SELECT name FROM employees WHERE salary > ALL (SELECT salary FROM employees);",
      "SELECT name, AVG(salary) FROM employees WHERE salary > 0 GROUP BY name;",
    ],
    answer: 1,
    explanation:
      "A scalar subquery computes the average once so each row can be compared against it. Aggregates are not allowed directly in WHERE, and > ALL can never be true because no salary exceeds itself.",
  },

  // ---------- Python ----------
  {
    id: "python-q1",
    skillId: "python",
    topicId: "python-basics",
    prompt: `What does this code print?\n\na = [1, 2, 3]\nb = a\nb.append(4)\nprint(len(a))`,
    options: ["3", "It raises an error", "4", "1"],
    answer: 2,
    explanation:
      "b = a does not copy the list; both names point to the same object, so appending through b also changes a. Use a.copy() to get an independent list.",
  },
  {
    id: "python-q2",
    skillId: "python",
    topicId: "python-basics",
    prompt: `What is the value of result?\n\nresult = [x ** 2 for x in range(5) if x % 2 == 0]`,
    options: ["[0, 4, 16]", "[4, 16]", "[1, 9]", "[0, 2, 4]"],
    answer: 0,
    explanation:
      "range(5) yields 0 to 4; the even values are 0, 2 and 4, and squaring them gives [0, 4, 16]. Zero counts as even.",
  },
  {
    id: "python-q3",
    skillId: "python",
    topicId: "python-numpy",
    prompt: `What does this code print?\n\nimport numpy as np\na = np.array([1, 2, 3])\nprint(a * 2)`,
    options: ["[1 2 3 1 2 3]", "[2 4 6]", "[1 2 3 2]", "It raises a TypeError"],
    answer: 1,
    explanation:
      "NumPy arithmetic is element-wise, so every element is doubled. The repeated-sequence result is what a plain Python list would give.",
  },
  {
    id: "python-q4",
    skillId: "python",
    topicId: "python-numpy",
    prompt: `What does this code print?\n\nimport numpy as np\narr = np.array([3, 8, 1, 9, 4])\nprint(arr[arr > 3].mean())`,
    options: ["5.0", "8.5", "6.0", "7.0"],
    answer: 3,
    explanation:
      "The boolean mask keeps only values greater than 3, which are 8, 9 and 4. Their mean is 21 / 3 = 7.0.",
  },
  {
    id: "python-q5",
    skillId: "python",
    topicId: "python-pandas-selection",
    prompt:
      "df has columns city and sales. Which expression correctly returns the rows where city is \"Pune\" and sales is above 100?",
    options: [
      `df[(df["city"] == "Pune") & (df["sales"] > 100)]`,
      `df[df["city"] == "Pune" and df["sales"] > 100]`,
      `df[df["city"] == "Pune" & df["sales"] > 100]`,
      `df.loc["city" == "Pune", "sales" > 100]`,
    ],
    answer: 0,
    explanation:
      "pandas needs the element-wise & operator, and each condition must be in parentheses because & binds tighter than == and >. Using the keyword and raises a ValueError about ambiguous truth values.",
  },
  {
    id: "python-q6",
    skillId: "python",
    topicId: "python-pandas-selection",
    prompt:
      "df has 5 rows and the default integer index 0 to 4. How many rows do df.loc[1:3] and df.iloc[1:3] return, in that order?",
    options: ["2 and 2", "3 and 3", "3 and 2", "2 and 3"],
    answer: 2,
    explanation:
      "loc slices by label and includes both endpoints (labels 1, 2, 3), while iloc slices by position like normal Python and excludes the end (positions 1, 2).",
  },
  {
    id: "python-q7",
    skillId: "python",
    topicId: "python-pandas-groupby-merge",
    prompt: `df has these four rows of (region, sales): ("N", 10), ("S", 20), ("N", 30), ("S", NaN). What does this return?\n\ndf.groupby("region")["sales"].mean()`,
    options: ["N 20.0, S NaN", "N 20.0, S 10.0", "N 40.0, S 20.0", "N 20.0, S 20.0"],
    answer: 3,
    explanation:
      "pandas aggregations skip NaN by default, so the S mean is computed from the single valid value 20, and N is (10 + 30) / 2 = 20.",
  },
  {
    id: "python-q8",
    skillId: "python",
    topicId: "python-pandas-groupby-merge",
    prompt: `left has one row each for id 1, 2 and 3. right has one row each for id 2, 3 and 4. What does this produce?\n\npd.merge(left, right, on="id", how="left")`,
    options: [
      "2 rows: only id 2 and 3",
      "3 rows: id 1, 2 and 3, with NaN in the right-hand columns for id 1",
      "4 rows: id 1, 2, 3 and 4",
      "3 rows: id 2, 3 and 4, with NaN in the left-hand columns for id 4",
    ],
    answer: 1,
    explanation:
      "A left merge keeps every row of the left frame and fills the right frame's columns with NaN where no match exists. id 4 exists only on the right, so it is dropped.",
  },

  // ---------- Excel ----------
  {
    id: "excel-q1",
    skillId: "excel",
    topicId: "excel-references",
    prompt:
      "Cell C2 contains =A2*$B$1, where B1 holds a tax rate. You copy C2 down to C3. What formula does C3 contain?",
    options: ["=A2*$B$1", "=A3*$B$1", "=A3*$B$2", "=A3*B2"],
    answer: 1,
    explanation:
      "The relative reference A2 shifts down one row to A3, while the absolute reference $B$1 stays locked on the tax rate.",
  },
  {
    id: "excel-q2",
    skillId: "excel",
    topicId: "excel-references",
    prompt:
      "You are building a multiplication grid. Cell B2 contains =$A2*B$1. You copy B2 to C3. What formula does C3 contain?",
    options: ["=$A2*B$1", "=$B3*C$2", "=$A3*B$1", "=$A3*C$1"],
    answer: 3,
    explanation:
      "In a mixed reference only the part without $ moves: $A2 keeps column A but its row becomes 3, and B$1 keeps row 1 but its column becomes C.",
  },
  {
    id: "excel-q3",
    skillId: "excel",
    topicId: "excel-conditional",
    prompt:
      "Column A holds Region, column B holds Product and column C holds Sales. Which formula totals Sales for the \"East\" region and the \"Pen\" product?",
    options: [
      `=SUMIFS(C:C, A:A, "East", B:B, "Pen")`,
      `=SUMIFS(A:A, "East", B:B, "Pen", C:C)`,
      `=SUMIF(A:A, "East", B:B, "Pen", C:C)`,
      `=SUM(C:C, A:A="East", B:B="Pen")`,
    ],
    answer: 0,
    explanation:
      "SUMIFS takes the sum range first, followed by pairs of criteria range and criteria. SUMIF only supports a single condition.",
  },
  {
    id: "excel-q4",
    skillId: "excel",
    topicId: "excel-conditional",
    prompt: `Cell A1 contains 75. What does this formula return?\n\n=IF(A1>=90, "A", IF(A1>=75, "B", "C"))`,
    options: [`"A"`, `"C"`, `"B"`, "#VALUE!"],
    answer: 2,
    explanation:
      "The first test (75 >= 90) is false, so Excel evaluates the nested IF. 75 >= 75 is true because >= includes the boundary, so it returns B.",
  },
  {
    id: "excel-q5",
    skillId: "excel",
    topicId: "excel-lookups",
    prompt:
      "=VLOOKUP(E2, A2:C100, 3) returns the wrong price for some product IDs and no error. The product list in column A is not sorted. What is the fix?",
    options: [
      "Change the column index from 3 to 2",
      "Wrap the formula in IFERROR",
      "Add FALSE as the fourth argument to force an exact match",
      "Convert the product IDs in column A to numbers",
    ],
    answer: 2,
    explanation:
      "When the fourth argument is omitted VLOOKUP does an approximate match, which assumes sorted data and silently returns a nearby row. FALSE (or 0) forces an exact match.",
  },
  {
    id: "excel-q6",
    skillId: "excel",
    topicId: "excel-lookups",
    prompt:
      "Employee names are in column A and employee IDs are in column C. Given an ID in F2, which formula returns the matching name?",
    options: [
      "=INDEX(A:A, MATCH(F2, C:C, 0))",
      "=VLOOKUP(F2, A:C, -2, FALSE)",
      "=VLOOKUP(F2, A:C, 1, FALSE)",
      "=MATCH(F2, A:A, 0)",
    ],
    answer: 0,
    explanation:
      "VLOOKUP can only search the leftmost column of its range and return values to the right of it. INDEX with MATCH finds the row in column C and returns the value from column A.",
  },
  {
    id: "excel-q7",
    skillId: "excel",
    topicId: "excel-pivot-tables",
    prompt:
      "You have 10,000 rows with Date, Region, Product and Revenue. Your manager wants total revenue for each region, broken out by product, in one grid. Which PivotTable layout does this?",
    options: [
      "Revenue in Rows, Region in Columns, Product in Values",
      "Region in Rows, Product in Columns, Sum of Revenue in Values",
      "Region and Product in Filters, Date in Values",
      "Date in Rows, Count of Region in Values",
    ],
    answer: 1,
    explanation:
      "Categories you want to break down by go in Rows and Columns, and the numeric measure being totalled goes in Values with the Sum aggregation.",
  },
  {
    id: "excel-q8",
    skillId: "excel",
    topicId: "excel-pivot-tables",
    prompt:
      "You paste 200 new rows directly below a PivotTable's source data and click Refresh, but the totals do not change. What is the most likely cause and fix?",
    options: [
      "PivotTables cannot be updated; delete it and build a new one",
      "Calculation mode is set to manual; press F9 to recalculate",
      "The new rows must be sorted by date before they are included",
      "The source is a fixed range that excludes the new rows; extend the data source or convert the data to an Excel Table",
    ],
    answer: 3,
    explanation:
      "Refresh only re-reads the defined source range. A fixed range such as A1:D10000 will not grow, whereas an Excel Table expands automatically as rows are added.",
  },

  // ---------- Statistics ----------
  {
    id: "statistics-q1",
    skillId: "statistics",
    topicId: "statistics-descriptive",
    prompt:
      "A 6-person startup has salaries of 30k, 32k, 35k, 38k, 40k and 400k (the founder). Which measure best describes what a typical employee earns?",
    options: ["The mean", "The range", "The median", "The standard deviation"],
    answer: 2,
    explanation:
      "The 400k outlier pulls the mean up to about 96k, which nobody actually earns. The median (36.5k) is robust to extreme values.",
  },
  {
    id: "statistics-q2",
    skillId: "statistics",
    topicId: "statistics-descriptive",
    prompt: "For the dataset 2, 4, 4, 6, 9, what are the mean and the median?",
    options: ["Mean 5, median 4", "Mean 4, median 5", "Mean 5, median 6", "Mean 4.5, median 4"],
    answer: 0,
    explanation:
      "The sum is 25, so the mean is 25 / 5 = 5. The median is the middle (third) value of the sorted data, which is 4.",
  },
  {
    id: "statistics-q3",
    skillId: "statistics",
    topicId: "statistics-probability",
    prompt:
      "60% of a site's visitors use mobile and 40% use desktop. 10% of mobile visitors make a purchase, and 5% of desktop visitors do. What is the overall purchase rate?",
    options: ["15%", "7.5%", "6%", "8%"],
    answer: 3,
    explanation:
      "By the law of total probability: 0.6 x 0.10 + 0.4 x 0.05 = 0.06 + 0.02 = 0.08. A simple average of 10% and 5% is wrong because the groups are different sizes.",
  },
  {
    id: "statistics-q4",
    skillId: "statistics",
    topicId: "statistics-probability",
    prompt:
      "Delivery times are approximately normally distributed with a mean of 30 minutes and a standard deviation of 5 minutes. Roughly what share of deliveries take longer than 40 minutes?",
    options: ["About 16%", "About 5%", "About 2.5%", "About 0.15%"],
    answer: 2,
    explanation:
      "40 minutes is 2 standard deviations above the mean. About 95% of values fall within 2 standard deviations, leaving roughly 5% in the two tails, so about 2.5% in the upper tail.",
  },
  {
    id: "statistics-q5",
    skillId: "statistics",
    topicId: "statistics-inference",
    prompt:
      "An A/B test comparing two checkout pages gives a p-value of 0.03, with a significance level of 0.05 chosen in advance. Which interpretation is correct?",
    options: [
      "There is a 97% probability that the new page is better",
      "If there were truly no difference, a result at least this extreme would occur about 3% of the time, so the null hypothesis is rejected",
      "There is a 3% probability that the null hypothesis is true",
      "The new page improves conversion by a large, practically important amount",
    ],
    answer: 1,
    explanation:
      "A p-value is the probability of data at least this extreme assuming the null hypothesis is true. It is not the probability that a hypothesis is true, and it says nothing about the size of the effect.",
  },
  {
    id: "statistics-q6",
    skillId: "statistics",
    topicId: "statistics-inference",
    prompt:
      "A survey of 100 randomly chosen customers gives a margin of error of about plus or minus 10 percentage points. Roughly how many customers must be surveyed to cut the margin of error to plus or minus 5 points?",
    options: ["150", "200", "1,000", "400"],
    answer: 3,
    explanation:
      "Margin of error shrinks with the square root of the sample size, so halving it requires four times as many respondents: 4 x 100 = 400.",
  },
  {
    id: "statistics-q7",
    skillId: "statistics",
    topicId: "statistics-correlation-regression",
    prompt:
      "Users who turn on push notifications have 40% higher 30-day retention than those who do not. A product manager concludes that notifications cause higher retention. What is the strongest critique?",
    options: [
      "Already-engaged users may be more likely to enable notifications, so the link may be confounded; a randomized experiment is needed",
      "A 40% difference is too small to matter",
      "Retention cannot be measured accurately over 30 days",
      "Correlation can only be calculated between two numeric columns",
    ],
    answer: 0,
    explanation:
      "Users chose whether to enable notifications, so the groups differ in ways (such as engagement) that also drive retention. Only random assignment can separate the effect of notifications from that self-selection.",
  },
  {
    id: "statistics-q8",
    skillId: "statistics",
    topicId: "statistics-correlation-regression",
    prompt:
      "A simple linear regression on monthly data gives: revenue = 2000 + 3.5 x ad_spend (both in dollars), with R-squared = 0.64. Which statement is correct?",
    options: [
      "Ad spend explains 3.5% of the variation in revenue",
      "Each additional $1 of ad spend is associated with about $3.50 more revenue on average",
      "With zero ad spend, predicted revenue is $3.50",
      "The correlation between ad spend and revenue is 0.64",
    ],
    answer: 1,
    explanation:
      "The slope is the average change in revenue per one-unit change in ad spend. The intercept (2000) is the prediction at zero spend, and in simple regression the correlation is the square root of R-squared, 0.8.",
  },

  // ---------- Data Visualization ----------
  {
    id: "data-viz-q1",
    skillId: "data-viz",
    topicId: "data-viz-chart-selection",
    prompt:
      "You need to show how monthly revenue changed over the last 3 years for two product lines. Which chart is the best choice?",
    options: [
      "A line chart with one line per product line",
      "Two pie charts, one per product line",
      "A scatter plot of product A revenue against product B revenue",
      "A single stacked bar showing the 3-year totals",
    ],
    answer: 0,
    explanation:
      "Line charts are built for continuous time series: they make trend, seasonality and the gap between the two series easy to read across 36 points.",
  },
  {
    id: "data-viz-q2",
    skillId: "data-viz",
    topicId: "data-viz-chart-selection",
    prompt:
      "You want to see whether local advertising spend is related to sales across 200 stores. Which chart should you use?",
    options: [
      "A pie chart of sales by store",
      "A line chart with stores ordered alphabetically on the x-axis",
      "A scatter plot with ad spend on the x-axis and sales on the y-axis",
      "A stacked bar chart of ad spend plus sales per store",
    ],
    answer: 2,
    explanation:
      "A scatter plot shows the relationship between two numeric variables, revealing direction, strength, clusters and outliers. A line across alphabetically ordered stores implies an order that does not exist.",
  },
  {
    id: "data-viz-q3",
    skillId: "data-viz",
    topicId: "data-viz-design-principles",
    prompt:
      "A bar chart compares satisfaction scores of 96, 97 and 98 for three teams, with the y-axis starting at 95. The last bar looks three times taller than the first. What is the problem?",
    options: [
      "Bar charts cannot display values above 90",
      "Bar length encodes the value, so a truncated axis exaggerates small differences; bars should start at zero",
      "The chart needs a 3D effect to show depth accurately",
      "There are too few categories for a bar chart",
    ],
    answer: 1,
    explanation:
      "Readers compare bar lengths, so cutting the axis makes a roughly 2% difference look like 200%. Bar charts should use a zero baseline.",
  },
  {
    id: "data-viz-q4",
    skillId: "data-viz",
    topicId: "data-viz-design-principles",
    prompt:
      "A map shades each state by its number of customers, from 0 to 50,000. Which color scheme is most appropriate?",
    options: [
      "A different distinct hue for every state",
      "A rainbow palette cycling through red, yellow, green and blue",
      "A diverging red-to-blue palette centered on 25,000",
      "A sequential palette running from a light to a dark shade of one hue",
    ],
    answer: 3,
    explanation:
      "Ordered low-to-high data maps naturally to lightness, so a sequential palette is read correctly without a legend. Diverging palettes are for data with a meaningful midpoint such as zero, and distinct hues are for categories.",
  },
  {
    id: "data-viz-q5",
    skillId: "data-viz",
    topicId: "data-viz-dashboards",
    prompt:
      "A sales dashboard has 14 charts on one screen, and managers say they cannot find what they need. What is the best first step?",
    options: [
      "Shrink every chart so more white space is visible",
      "Identify the few questions the audience must answer, keep the KPIs that serve them on top, and move the rest to drill-down views",
      "Apply a different color theme to each chart so they are easier to tell apart",
      "Replace all the charts with one large data table",
    ],
    answer: 1,
    explanation:
      "Dashboards fail when they are organised around available data rather than the decisions users make. Start from the audience's questions and prioritise ruthlessly.",
  },
  {
    id: "data-viz-q6",
    skillId: "data-viz",
    topicId: "data-viz-dashboards",
    prompt:
      "A dashboard calculates company-wide average order value by averaging the four regional averages. The number does not match finance's figure. Why?",
    options: [
      "An average of averages ignores that regions have different order counts; it should be total revenue divided by total orders",
      "Averages cannot be displayed on dashboards, only totals",
      "Finance must be using the median instead of the mean",
      "The regional figures need to be rounded before they are averaged",
    ],
    answer: 0,
    explanation:
      "Averaging averages gives a small region the same weight as a large one. The correct overall figure is computed from the underlying totals, or as a weighted average.",
  },
  {
    id: "data-viz-q7",
    skillId: "data-viz",
    topicId: "data-viz-storytelling",
    prompt:
      "You are presenting one slide to executives showing that the West region declined while the others grew. Which chart title is most effective?",
    options: [
      "Sales by Region",
      "Figure 3: Regional Sales Data (Q3)",
      "Regional Performance Overview",
      "West region sales fell 18% in Q3 while every other region grew",
    ],
    answer: 3,
    explanation:
      "A title that states the takeaway tells the audience what to see in the chart and what matters, instead of making them work it out themselves.",
  },
  {
    id: "data-viz-q8",
    skillId: "data-viz",
    topicId: "data-viz-storytelling",
    prompt:
      "Your line chart shows 8 product lines, but the story is about just one of them falling behind. What is the best way to focus the audience?",
    options: [
      "Give all 8 lines bright, saturated colors and a large legend",
      "Remove the other 7 lines completely",
      "Draw the other 7 lines in light gray and the key line in a strong color with a short annotation",
      "Split the data into 8 separate pie charts",
    ],
    answer: 2,
    explanation:
      "Muting the context and highlighting one series directs attention while still letting the audience compare it to the rest. Deleting the other lines removes the comparison that makes the point.",
  },

  // ---------- Data Cleaning ----------
  {
    id: "data-cleaning-q1",
    skillId: "data-cleaning",
    topicId: "data-cleaning-types-formats",
    prompt:
      "After importing a CSV, the order_amount column contains values like \"$1,250.00\" and \"$300\", and summing the column fails or returns 0. What is the correct fix?",
    options: [
      "Sort the column so the largest values come first",
      "Delete the rows that contain a currency symbol",
      "Round every value to the nearest whole number",
      "Strip the currency symbol and thousands separators, then convert the column to a numeric type",
    ],
    answer: 3,
    explanation:
      "The values were read as text because of the $ and comma characters. Removing them and casting to a number lets arithmetic work without losing any rows.",
  },
  {
    id: "data-cleaning-q2",
    skillId: "data-cleaning",
    topicId: "data-cleaning-types-formats",
    prompt:
      "After loading a customer file, the US ZIP code \"02134\" appears as 2134. What caused this, and how should it be handled?",
    options: [
      "The file is corrupted; request a new export",
      "The column was parsed as a number, dropping the leading zero; ZIP codes are identifiers and should be loaded as text",
      "The ZIP code is invalid and the row should be deleted",
      "The value was rounded; increase the number of decimal places",
    ],
    answer: 1,
    explanation:
      "Identifiers such as ZIP codes, phone numbers and account IDs are not quantities. They should be read as strings so leading zeros and formatting survive.",
  },
  {
    id: "data-cleaning-q3",
    skillId: "data-cleaning",
    topicId: "data-cleaning-missing-values",
    prompt:
      "An age-of-account column is heavily right-skewed with a few extreme values, and about 3% of its values are missing at random. Which simple imputation is most reasonable?",
    options: [
      "Fill the gaps with the median",
      "Fill the gaps with 0",
      "Fill the gaps with the mean",
      "Drop the whole column",
    ],
    answer: 0,
    explanation:
      "With skewed data the mean is dragged toward the extreme values, while the median stays typical. Filling with 0 invents fake values, and dropping a column over 3% missing wastes data.",
  },
  {
    id: "data-cleaning-q4",
    skillId: "data-cleaning",
    topicId: "data-cleaning-missing-values",
    prompt:
      "The average of a city temperature column comes out as -150 degrees C. Inspecting the data, you see many readings of exactly -999. What is going on, and what should you do?",
    options: [
      "The sensors recorded extreme cold; keep the values",
      "The values are in Fahrenheit; convert them to Celsius",
      "-999 is a placeholder for missing readings; replace it with a true null before computing statistics",
      "The average is wrong because the column needs to be sorted first",
    ],
    answer: 2,
    explanation:
      "Sentinel codes such as -999, 9999 or \"N/A\" are common stand-ins for missing data. Left as numbers they silently corrupt every aggregate, so convert them to nulls first.",
  },
  {
    id: "data-cleaning-q5",
    skillId: "data-cleaning",
    topicId: "data-cleaning-duplicates-consistency",
    prompt:
      "A mailing list contains \"john@x.com\" and \"John@X.com \" (with a trailing space). An exact-match duplicate check finds nothing. What should you do before deduplicating?",
    options: [
      "Sort the list alphabetically",
      "Delete every row whose email contains a capital letter",
      "Remove only rows that are identical in every column",
      "Trim whitespace and convert the emails to lowercase",
    ],
    answer: 3,
    explanation:
      "Deduplication compares exact strings, so differences in case and stray spaces hide real duplicates. Normalise the key first, then remove duplicates.",
  },
  {
    id: "data-cleaning-q6",
    skillId: "data-cleaning",
    topicId: "data-cleaning-duplicates-consistency",
    prompt:
      "Total revenue is 1.0M in the orders table. After joining orders to the customers table on customer_id, total revenue shows 1.4M. What is the most likely cause?",
    options: [
      "The join converted the revenue to a different currency",
      "Some customer_id values appear more than once in customers, so their orders were duplicated by the join",
      "Orders with a missing customer_id were added twice",
      "Joins always increase numeric totals slightly because of rounding",
    ],
    answer: 1,
    explanation:
      "When the lookup table has duplicate keys, each matching order row is repeated once per duplicate, inflating sums. Check key uniqueness and deduplicate before joining.",
  },
  {
    id: "data-cleaning-q7",
    skillId: "data-cleaning",
    topicId: "data-cleaning-outliers-validation",
    prompt:
      "For a delivery-time column, Q1 is 20 minutes and Q3 is 40 minutes. Using the 1.5 x IQR rule, which of these values is flagged as an outlier?",
    options: ["5", "65", "75", "68"],
    answer: 2,
    explanation:
      "The IQR is 20, so the fences are 20 - 30 = -10 and 40 + 30 = 70. Only 75 falls outside the range of -10 to 70.",
  },
  {
    id: "data-cleaning-q8",
    skillId: "data-cleaning",
    topicId: "data-cleaning-outliers-validation",
    prompt:
      "Your cleaning script ran without errors. Which check best confirms that it did not silently lose or distort data?",
    options: [
      "Reconcile row counts and key totals before and after cleaning, and account for every dropped row",
      "Confirm that the output file is smaller than the input file",
      "Look at the first 10 rows of the output",
      "Run the script a second time and confirm it finishes again",
    ],
    answer: 0,
    explanation:
      "A script can succeed technically while a bad filter or join removes or duplicates records. Comparing counts and control totals, with documented reasons for each difference, catches that.",
  },
];

export const plans: SkillPlan[] = [
  {
    skillId: "sql",
    days: [
      {
        topicId: "sql-filtering",
        title: "SELECT, WHERE and NULL logic",
        minutes: 60,
        summary: "Write precise row filters and avoid the classic NULL and AND/OR precedence traps.",
        learn: [
          "SELECT, WHERE, ORDER BY, LIMIT and DISTINCT, and the order in which a query is logically evaluated",
          "Comparison operators, IN, BETWEEN and LIKE with wildcards",
          "Three-valued logic: why = NULL never matches, and how IS NULL, IS NOT NULL and COALESCE behave",
          "AND versus OR precedence and using parentheses to make intent explicit",
        ],
        practice:
          "On any sample orders table, write 8 filter queries (date range, multiple statuses, pattern match, missing values) and predict each row count before you run it.",
      },
      {
        topicId: "sql-aggregation",
        title: "GROUP BY, aggregates and HAVING",
        minutes: 75,
        summary: "Summarise data per group and filter on aggregated results correctly.",
        learn: [
          "COUNT(*) versus COUNT(column) versus COUNT(DISTINCT column), and how SUM, AVG, MIN and MAX treat NULL",
          "GROUP BY rules: every non-aggregated column in SELECT must be grouped",
          "WHERE filters rows before grouping; HAVING filters groups after aggregation",
          "Conditional aggregation with SUM(CASE WHEN ... THEN 1 ELSE 0 END)",
        ],
        practice:
          "Produce a per-customer summary with order count, total spend, average order value and count of cancelled orders, keeping only customers with more than 3 orders.",
      },
      {
        topicId: "sql-joins",
        title: "Joins and row multiplication",
        minutes: 90,
        summary: "Combine tables confidently and predict how many rows each join type returns.",
        learn: [
          "INNER, LEFT, RIGHT and FULL OUTER joins, and what happens to unmatched rows in each",
          "The anti-join pattern: LEFT JOIN plus WHERE right.key IS NULL to find records with no match",
          "One-to-many joins and how duplicate keys inflate counts and sums",
          "Why a filter on the right table belongs in ON rather than WHERE when you need to keep unmatched left rows",
        ],
        practice:
          "With customers, orders and order_items tables, find customers with no orders, revenue per customer, and prove your revenue total matches the order_items total.",
      },
      {
        topicId: "sql-subqueries-windows",
        title: "Subqueries, CTEs and window functions",
        minutes: 90,
        summary: "Answer compare-to-the-group and ranking questions without collapsing rows.",
        learn: [
          "Scalar subqueries, IN and EXISTS subqueries, and correlated subqueries",
          "Common table expressions (WITH) for breaking a query into readable steps",
          "Window functions with OVER, PARTITION BY and ORDER BY: ROW_NUMBER, RANK, DENSE_RANK",
          "Running totals and period-over-period comparisons with SUM() OVER and LAG",
        ],
        practice:
          "Write a query that returns the top 2 highest-paid employees in each department, then another that shows each month's revenue alongside the previous month's.",
      },
      {
        topicId: null,
        title: "Challenge: answer five business questions",
        minutes: 120,
        summary: "Work an end-to-end analysis on a small e-commerce schema using everything from days 1 to 4.",
        learn: [
          "Translating a vague business question into tables, grain, filters and metrics before writing SQL",
          "Sanity-checking results by reconciling row counts and totals at each step",
          "Formatting queries consistently so a reviewer can follow them",
        ],
        practice:
          "On a customers/orders/order_items/products dataset, answer: monthly revenue trend, top 5 products by revenue, customers who never ordered, repeat-purchase rate, and each customer's rank by spend within their city. Write one short sentence of insight per query.",
      },
    ],
  },
  {
    skillId: "python",
    days: [
      {
        topicId: "python-basics",
        title: "Core Python for analysts",
        minutes: 75,
        summary: "Get fluent with the data structures and idioms that every data script relies on.",
        learn: [
          "Lists, tuples, dictionaries and sets: when to use each and how to index and slice them",
          "Mutability and references: why b = a does not copy a list",
          "Loops, conditionals, list and dictionary comprehensions",
          "Writing small functions with arguments, return values and default parameters",
        ],
        practice:
          "Given a list of order dictionaries, write functions that return total revenue, revenue per customer as a dictionary, and the list of orders above a threshold using a comprehension.",
      },
      {
        topicId: "python-numpy",
        title: "NumPy arrays and vectorization",
        minutes: 60,
        summary: "Replace loops with fast element-wise array operations.",
        learn: [
          "Creating arrays, shape, dtype and the difference between a list and an ndarray",
          "Element-wise arithmetic and broadcasting a scalar or row across an array",
          "Boolean masks for filtering, and np.where for conditional values",
          "Aggregations such as sum, mean and std, and the axis argument for 2D arrays",
        ],
        practice:
          "Create an array of 1,000 random daily sales values; without any loop, compute the mean, the share of days above target, and a copy where values below zero are replaced with zero.",
      },
      {
        topicId: "python-pandas-selection",
        title: "pandas: loading, selecting and filtering",
        minutes: 90,
        summary: "Load a dataset into a DataFrame and pull out exactly the rows and columns you need.",
        learn: [
          "Reading CSV files and inspecting with head, info, describe and value_counts",
          "Selecting columns, and label-based loc versus position-based iloc, including their slicing differences",
          "Boolean filtering with &, | and ~, why each condition needs parentheses, plus isin and between",
          "Sorting, creating new columns and avoiding chained-assignment mistakes",
        ],
        practice:
          "Load a public sales or movies CSV and answer 6 questions using filters only, for example the top 10 rows by value within one category and one year.",
      },
      {
        topicId: "python-pandas-groupby-merge",
        title: "pandas: groupby, merge and reshape",
        minutes: 90,
        summary: "Summarise by category and combine multiple tables the way you would in SQL.",
        learn: [
          "groupby with single and multiple aggregations using agg, and how NaN values are skipped",
          "merge with how set to inner, left, right or outer, and checking row counts before and after",
          "Diagnosing unexpected row growth caused by duplicate keys, using the validate argument",
          "pivot_table for cross-tab summaries",
        ],
        practice:
          "Merge an orders file with a customers file, then produce revenue and order count by region and month, and confirm the merged total revenue matches the original.",
      },
      {
        topicId: null,
        title: "Challenge: mini analysis notebook",
        minutes: 120,
        summary: "Build a complete, reproducible analysis in one notebook from raw file to findings.",
        learn: [
          "Structuring a notebook: load, inspect, clean, analyse, conclude",
          "Writing small reusable functions instead of copy-pasted cells",
          "Stating findings in plain language backed by specific numbers",
        ],
        practice:
          "Take two related CSV files (for example transactions and products), load and merge them, compute 3 grouped metrics, use a NumPy-based calculated column, and end with three written insights. Restart the kernel and run everything top to bottom to prove it works.",
      },
    ],
  },
  {
    skillId: "excel",
    days: [
      {
        topicId: "excel-references",
        title: "Formulas and cell references",
        minutes: 45,
        summary: "Write formulas that still work when they are copied across rows and columns.",
        learn: [
          "Relative, absolute and mixed references, and what each $ locks",
          "Toggling reference types with F4 and predicting the formula after copy and fill",
          "Order of operations and core functions: SUM, AVERAGE, ROUND, MIN, MAX",
          "Named ranges and Excel Tables with structured references",
        ],
        practice:
          "Build a 10 x 10 multiplication grid from a single formula using mixed references, then a price list that applies one tax-rate cell to every row.",
      },
      {
        topicId: "excel-conditional",
        title: "IF, SUMIFS and COUNTIFS",
        minutes: 60,
        summary: "Make spreadsheets that categorise rows and total by multiple conditions.",
        learn: [
          "IF, nested IF and IFS, and how boundary conditions such as >= are evaluated in order",
          "Combining conditions with AND and OR",
          "SUMIFS, COUNTIFS and AVERAGEIFS argument order, and using operators and wildcards in criteria",
          "Handling errors gracefully with IFERROR",
        ],
        practice:
          "On a sales sheet, add a performance-band column with nested IF, then build a small summary block of revenue and order count by region and product using SUMIFS and COUNTIFS.",
      },
      {
        topicId: "excel-lookups",
        title: "VLOOKUP, INDEX/MATCH and XLOOKUP",
        minutes: 75,
        summary: "Pull matching data from another table reliably and debug lookups that fail.",
        learn: [
          "VLOOKUP arguments, exact versus approximate match, and why omitting the fourth argument is dangerous",
          "VLOOKUP's limitation of only looking to the right, and INDEX with MATCH as the flexible alternative",
          "XLOOKUP for left lookups and built-in not-found handling",
          "Common causes of #N/A: trailing spaces, numbers stored as text and mismatched keys",
        ],
        practice:
          "Given an orders sheet and a products sheet, bring product name, category and price into orders three ways (VLOOKUP, INDEX/MATCH, XLOOKUP) and fix at least two deliberate #N/A errors.",
      },
      {
        topicId: "excel-pivot-tables",
        title: "PivotTables for fast analysis",
        minutes: 75,
        summary: "Summarise thousands of rows in seconds and keep the summary up to date.",
        learn: [
          "Preparing tidy source data and converting it to an Excel Table so ranges grow automatically",
          "Rows, Columns, Values and Filters, and changing the aggregation between Sum, Count and Average",
          "Grouping dates by month or quarter, and showing values as a percentage of total",
          "Refreshing, changing the data source, slicers and PivotCharts",
        ],
        practice:
          "From a transaction list of at least 1,000 rows, build a PivotTable of revenue by region and product, grouped by quarter, with a slicer for sales channel; add new rows and confirm they appear after a refresh.",
      },
      {
        topicId: null,
        title: "Challenge: monthly sales report workbook",
        minutes: 120,
        summary: "Combine references, conditional formulas, lookups and PivotTables into one deliverable.",
        learn: [
          "Separating raw data, calculations and report sheets in a workbook",
          "Cross-checking PivotTable totals against SUMIFS totals to catch errors",
          "Formatting a report so the key numbers are readable at a glance",
        ],
        practice:
          "Starting from raw orders and a product lookup sheet, enrich the orders with lookups, flag large orders with IF, build a formula-driven KPI block, add a PivotTable with a chart by month and category, and verify both methods give the same totals.",
      },
    ],
  },
  {
    skillId: "statistics",
    days: [
      {
        topicId: "statistics-descriptive",
        title: "Describing data honestly",
        minutes: 60,
        summary: "Summarise a dataset's centre and spread and know which measure to trust.",
        learn: [
          "Mean, median and mode, and how skew and outliers affect each",
          "Range, variance, standard deviation and interquartile range",
          "Percentiles, quartiles and reading a box plot and a histogram",
          "Why a single average can hide very different distributions",
        ],
        practice:
          "For a salary or house-price dataset, compute mean, median, standard deviation and IQR by hand or in a spreadsheet, add one extreme value, and write down which measures changed and why.",
      },
      {
        topicId: "statistics-probability",
        title: "Probability and the normal distribution",
        minutes: 75,
        summary: "Reason about chance, conditional probability and how values spread around a mean.",
        learn: [
          "Basic rules: complements, independent events and the addition and multiplication rules",
          "Conditional probability and the law of total probability for weighted rates",
          "The normal distribution, z-scores and the 68-95-99.7 rule",
          "Base rates and why averaging group percentages without weights is wrong",
        ],
        practice:
          "Solve 8 short problems: overall conversion rate from segment rates, the chance of two independent failures, and the share of values beyond 1, 2 and 3 standard deviations for a given mean and spread.",
      },
      {
        topicId: "statistics-inference",
        title: "Samples, confidence and hypothesis tests",
        minutes: 90,
        summary: "Judge whether a difference seen in a sample is real or just noise.",
        learn: [
          "Populations versus samples, sampling bias and the standard error",
          "Confidence intervals and how margin of error shrinks with the square root of sample size",
          "Null and alternative hypotheses, p-values, significance level, and Type I and Type II errors",
          "Statistical significance versus practical significance in A/B tests",
        ],
        practice:
          "Take a published or made-up A/B test result (visitors and conversions per variant), compute the conversion rates and a confidence interval for each, and write a three-sentence recommendation that correctly interprets the p-value.",
      },
      {
        topicId: "statistics-correlation-regression",
        title: "Correlation and simple regression",
        minutes: 75,
        summary: "Quantify relationships between variables without confusing them with causes.",
        learn: [
          "The correlation coefficient: direction, strength and its sensitivity to outliers and non-linear patterns",
          "Correlation versus causation, confounding variables and self-selection",
          "Simple linear regression: interpreting slope, intercept and R-squared",
          "The danger of extrapolating beyond the observed data range",
        ],
        practice:
          "Using a dataset with two numeric columns (such as ad spend and sales), draw a scatter plot, compute the correlation, fit a trend line, and explain the slope and R-squared in plain language, listing one possible confounder.",
      },
      {
        topicId: null,
        title: "Challenge: statistical brief for a manager",
        minutes: 120,
        summary: "Apply all four topics to one dataset and communicate the findings without jargon.",
        learn: [
          "Choosing the right summary statistics for skewed business data",
          "Stating uncertainty clearly with ranges rather than single numbers",
          "A checklist of common misreadings: p-values, averages of averages and causal claims",
        ],
        practice:
          "Using a dataset with a group column and at least two numeric columns, describe each group, compare two groups with a confidence interval or test, examine one relationship with correlation and regression, and write a one-page brief with findings and caveats.",
      },
    ],
  },
  {
    skillId: "data-viz",
    days: [
      {
        topicId: "data-viz-chart-selection",
        title: "Matching the chart to the question",
        minutes: 60,
        summary: "Pick a chart type based on the comparison the audience needs to make.",
        learn: [
          "The main analytical purposes: comparison, trend over time, distribution, relationship and part-to-whole",
          "When to use bar, line, scatter, histogram and box plots",
          "Why pie charts break down beyond a few slices, and what to use instead",
          "Sorting categories and choosing horizontal bars for long labels",
        ],
        practice:
          "Write 10 business questions about a sales dataset and, for each, name the chart type and the fields on each axis; build three of them in a spreadsheet or BI tool.",
      },
      {
        topicId: "data-viz-design-principles",
        title: "Clear and honest chart design",
        minutes: 75,
        summary: "Remove clutter and avoid design choices that mislead the reader.",
        learn: [
          "Zero baselines for bars, truncated axes, dual axes and other common sources of distortion",
          "Reducing clutter: gridlines, borders, redundant legends and 3D effects",
          "Sequential, diverging and categorical color palettes, and designing for color-blind readers",
          "Direct labelling, readable number formats and consistent scales across small multiples",
        ],
        practice:
          "Find or create a cluttered default chart, list every problem you can see, then rebuild it and place the before and after versions side by side with a note on each change.",
      },
      {
        topicId: "data-viz-dashboards",
        title: "Dashboards and KPIs",
        minutes: 90,
        summary: "Design a dashboard around decisions rather than around available data.",
        learn: [
          "Defining audience, decisions and the handful of KPIs that serve them before building anything",
          "Layout hierarchy: headline KPIs with context at the top, trends next, detail and drill-down last",
          "Giving numbers context with targets, prior-period comparisons and sensible time ranges",
          "Correct aggregation: ratios from totals rather than averages of averages, and consistent filters",
        ],
        practice:
          "Sketch on paper, then build, a one-screen sales dashboard with 3 KPI tiles with comparisons, one trend chart, one breakdown chart and one filter, and verify each KPI against a manual calculation.",
      },
      {
        topicId: "data-viz-storytelling",
        title: "Storytelling with data",
        minutes: 60,
        summary: "Turn a correct chart into a message an audience understands and acts on.",
        learn: [
          "Exploratory versus explanatory charts, and leading with the conclusion",
          "Takeaway titles that state the insight instead of describing the axes",
          "Directing attention with gray-and-highlight color, annotations and reference lines",
          "Sequencing a short narrative: context, finding, implication and recommendation",
        ],
        practice:
          "Take one chart from earlier in the week and produce an executive version with a takeaway title, one highlighted series, one annotation and a single-sentence recommendation.",
      },
      {
        topicId: null,
        title: "Challenge: from dataset to a 3-slide story",
        minutes: 120,
        summary: "Explore a dataset, find one meaningful insight and present it professionally.",
        learn: [
          "Exploring quickly with many rough charts before polishing any of them",
          "Checking every number on a slide against the source data",
          "Getting feedback by asking someone what they think the chart says",
        ],
        practice:
          "Using a public dataset, build a small dashboard for exploration, then create three slides (context, key finding, recommendation), each with one well-designed chart and a takeaway title. Ask a friend to state the message of each slide in five seconds.",
      },
    ],
  },
  {
    skillId: "data-cleaning",
    days: [
      {
        topicId: "data-cleaning-types-formats",
        title: "Profiling data and fixing types",
        minutes: 60,
        summary: "Inspect a raw file and get every column into the correct type and format.",
        learn: [
          "Profiling a dataset first: row counts, column types, distinct values and minimum and maximum per column",
          "Numbers stored as text because of currency symbols, separators and stray spaces",
          "Identifiers such as ZIP codes and phone numbers that must stay as text to keep leading zeros",
          "Parsing dates with an explicit format and standardising on the ISO year-month-day form",
        ],
        practice:
          "Take a messy CSV and write a column-by-column profile listing the current type, intended type and problems found, then convert every column and confirm sums and date sorts now work.",
      },
      {
        topicId: "data-cleaning-missing-values",
        title: "Handling missing values",
        minutes: 75,
        summary: "Find missing data in all its disguises and choose a defensible way to treat it.",
        learn: [
          "Detecting true nulls as well as disguised ones: empty strings, N/A text and sentinel codes such as -999",
          "Measuring missingness per column and checking whether it is random or concentrated in a segment",
          "Options and trade-offs: drop rows, drop columns, impute with the median, mean or mode, or add a missing flag",
          "Why filling numeric gaps with 0 usually distorts averages",
        ],
        practice:
          "On a dataset with gaps, build a missingness table per column, convert all placeholder codes to nulls, apply and justify a treatment for each column, and compare key averages before and after.",
      },
      {
        topicId: "data-cleaning-duplicates-consistency",
        title: "Duplicates and inconsistent values",
        minutes: 75,
        summary: "Standardise text and keys so that the same real-world thing appears exactly once.",
        learn: [
          "Normalising text before comparing: trimming whitespace, consistent case and removing punctuation",
          "Mapping category variants such as NY, N.Y. and New York to one standard value",
          "Exact versus key-based duplicates, and choosing which record to keep",
          "Checking key uniqueness before joins to prevent duplicated rows and inflated totals",
        ],
        practice:
          "Clean a customer list with inconsistent emails, city names and repeated records; report how many duplicates were found before and after normalisation, then join it to an orders table and prove revenue did not change.",
      },
      {
        topicId: "data-cleaning-outliers-validation",
        title: "Outliers and validation checks",
        minutes: 90,
        summary: "Separate data errors from genuine extremes and prove the cleaned data can be trusted.",
        learn: [
          "Spotting outliers with the 1.5 x IQR rule, z-scores, box plots and simple range rules",
          "Deciding between correcting, flagging, capping and removing, and documenting the reason",
          "Validation rules: allowed ranges, allowed categories, uniqueness and cross-field logic",
          "Reconciling row counts and control totals before and after every cleaning step",
        ],
        practice:
          "Compute IQR fences for two numeric columns, investigate each flagged value and record a decision for it, then write five validation rules and a before and after reconciliation table.",
      },
      {
        topicId: null,
        title: "Challenge: clean a messy dataset end to end",
        minutes: 120,
        summary: "Deliver an analysis-ready dataset with a repeatable process and a written cleaning log.",
        learn: [
          "Ordering the steps: profile, fix types, handle missing values, standardise, deduplicate, treat outliers, validate",
          "Keeping raw data untouched and making every step repeatable in a script or query",
          "Writing a cleaning log that states what changed, how many rows were affected and why",
        ],
        practice:
          "Take a deliberately messy public dataset (or dirty a clean one yourself), clean it with a rerunnable script or documented steps, and hand in the cleaned file, a cleaning log and a reconciliation of row counts and totals against the raw data.",
      },
    ],
  },
];
