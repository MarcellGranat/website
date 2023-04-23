---
title: currr
author: Marcell Granat
date: '2023-02-14'
format: hugo
slug: currr
tags:
  - currr
summary: "I've recently developed a new R package called `currr` (checkpoints & purrr), and I'm thrilled to share it with you. With currr, you can easily manage time-consuming iterations, parallel computing and multitasking."
links:
- icon: code
  icon_pack: fas
  name: GitHub
  url: https://github.com/MarcellGranat/currr
- icon: link
  icon_pack: fas
  name: Website
  url: https://marcellgranat.com/currr
---

# currr <img src="https://raw.githubusercontent.com/MarcellGranat/marcellgranat-website/main/static/currr/logo.png" align="right" width="120px" />

<!-- badges: start -->

\[![CRAN_Status_Badge](https://www.r-pkg.org/badges/version/currr.png)
<!-- badges: end -->

## Overview

> A long journey is best broken into small steps, and the importance of
> taking a rest must never be underestimated.

The **currr** package is a wrapper for the `purrr::map()` family but
extends the iteration process with a certain number of **checkpoints**
(`currr` = `c`heckpoints + `purrr`), where the evaluated results are
saved, and we can always restart from there.

<img src="https://raw.githubusercontent.com/MarcellGranat/marcellgranat-website/main/static/currr/example.gif" align="center" />

Implementations of the family of map() functions with a frequent saving
of the intermediate results. The contained functions let you **start**
the evaluation of the iterations **where you stopped** (reading the
already evaluated ones from the cache), and **work with the currently
evaluated iterations** while the remaining ones are running in a
background job. **Parallel** computing is also easier with the `workers`
parameter.

## Installation

``` r
install.packages("currr")
```

## Usage

The following example uses `currr` to present an everyday issue: run a
time-demanding iteration, but you want to rerun it again.

``` r
library(tidyverse)
```

    ── Attaching packages ─────────────────────────────────────── tidyverse 1.3.2 ──
    ✔ ggplot2 3.4.1     ✔ purrr   1.0.1
    ✔ tibble  3.2.1     ✔ dplyr   1.1.1
    ✔ tidyr   1.3.0     ✔ stringr 1.5.0
    ✔ readr   2.1.4     ✔ forcats 1.0.0
    ── Conflicts ────────────────────────────────────────── tidyverse_conflicts() ──
    ✖ dplyr::filter() masks stats::filter()
    ✖ dplyr::lag()    masks stats::lag()

``` r
library(currr)

options(currr.folder = ".currr", currr.wait = Inf)
# folder in your wd, where to save cache data

avg_n <- function(.data, .col, x) {
  # meaningless function that takes about 1 sec
  Sys.sleep(1)

  .data |>
    dplyr::pull({{ .col }}) |>
    (\(m) mean(m) * x) ()
}
```

### Checkpoints

``` r
tictoc::tic(msg = "First evaluation")

cp_map(.x = 1:50, .f = avg_n, .data = iris,
       .col = Sepal.Length,
       name = "iris_mean") |>
  head(3)
```

    ✓ Everything is unchanged. Reading cache.

    |██████████████████████████████████████████████████ | 12% ETA:  45 sec                         
    |██████████████████████████████████████████████████ | 14% ETA:  44 sec                         
    |██████████████████████████████████████████████████ | 16% ETA:  25 sec (polynomial est.)       
    |██████████████████████████████████████████████████ | 18% ETA:  42 sec                         
    |██████████████████████████████████████████████████ | 20% ETA:  41 sec                         
    |██████████████████████████████████████████████████ | 22% ETA:  1 min 29 sec (polynomial est.) 
    |██████████████████████████████████████████████████ | 24% ETA:  39 sec                         
    |██████████████████████████████████████████████████ | 26% ETA:  38 sec                         
    |██████████████████████████████████████████████████ | 28% ETA:  37 sec                         
    |██████████████████████████████████████████████████ | 30% ETA:  36 sec                         
    |██████████████████████████████████████████████████ | 32% ETA:  35 sec                         
    |██████████████████████████████████████████████████ | 34% ETA:  34 sec                         
    |██████████████████████████████████████████████████ | 36% ETA:  33 sec                         
    |██████████████████████████████████████████████████ | 38% ETA:  32 sec                         
    |██████████████████████████████████████████████████ | 40% ETA:  31 sec                         
    |██████████████████████████████████████████████████ | 42% ETA:  30 sec                         
    |██████████████████████████████████████████████████ | 44% ETA:  29 sec                         
    |██████████████████████████████████████████████████ | 46% ETA:  28 sec                         
    |██████████████████████████████████████████████████ | 48% ETA:  27 sec                         
    |██████████████████████████████████████████████████ | 50% ETA:  26 sec                         
    |██████████████████████████████████████████████████ | 52% ETA:  25 sec                         
    |██████████████████████████████████████████████████ | 54% ETA:  24 sec                         
    |██████████████████████████████████████████████████ | 56% ETA:  23 sec                         
    |██████████████████████████████████████████████████ | 58% ETA:  22 sec                         
    |██████████████████████████████████████████████████ | 60% ETA:  21 sec                         
    |██████████████████████████████████████████████████ | 62% ETA:  20 sec                         
    |██████████████████████████████████████████████████ | 64% ETA:  19 sec                         
    |██████████████████████████████████████████████████ | 66% ETA:  18 sec                         
    |██████████████████████████████████████████████████ | 68% ETA:  17 sec                         
    |██████████████████████████████████████████████████ | 70% ETA:  16 sec                         
    |██████████████████████████████████████████████████ | 72% ETA:  15 sec                         
    |██████████████████████████████████████████████████ | 74% ETA:  14 sec                         
    |██████████████████████████████████████████████████ | 76% ETA:  13 sec                         
    |██████████████████████████████████████████████████ | 78% ETA:  12 sec                         
    |██████████████████████████████████████████████████ | 80% ETA:  11 sec                         
    |██████████████████████████████████████████████████ | 82% ETA:  10 sec                         
    |██████████████████████████████████████████████████ | 84% ETA:  9 sec                          
    |██████████████████████████████████████████████████ | 86% ETA:  8 sec                          
    |██████████████████████████████████████████████████ | 88% ETA:  7 sec                          
    |██████████████████████████████████████████████████ | 90% ETA:  6 sec                          
    |██████████████████████████████████████████████████ | 92% ETA:  5 sec                          
    |██████████████████████████████████████████████████ | 94% ETA:  4 sec                          
    |██████████████████████████████████████████████████ | 96% ETA:  3 sec                          
    |██████████████████████████████████████████████████ | 98% ETA:  2 sec                          
    |██████████████████████████████████████████████████ | 100% ETA:  0 sec                          

    [[1]]
    [1] 5.843333

    [[2]]
    [1] 11.68667

    [[3]]
    [1] 17.53

``` r
tictoc::toc() # ~ 1:50 => 50 x 1 sec
```

    First evaluation: 47.778 sec elapsed

``` r
tictoc::tic(msg = "Second evaluation")

cp_map(.x = 1:50, .f = avg_n, .data = iris,
       .col = Sepal.Length,
       name = "iris_mean") |>
  head(3)
```

    ✓ Everything is unchanged. Reading cache.

    [[1]]
    [1] 5.843333

    [[2]]
    [1] 11.68667

    [[3]]
    [1] 17.53

``` r
tictoc::toc() # ~ 0 sec
```

    Second evaluation: 0.041 sec elapsed

If the `.x` input and `.f` are the same, then the 2nd time you call the
function, it reads the outcome from the specified folder (`.currr`).
Also if `.x` changes, but some of its part remain the same, then that
part is taken from the previously saved results, and only the new
elements of `.x` are called for evaluation. (If `.f` changes, then the
process will start from zero.)

``` r
tictoc::tic(msg = "Partly modification")

cp_map(.x = 20:60, .f = avg_n, .data = iris,
       .col = Sepal.Length,
       name = "iris_mean") |>
  head(3)
```

    ⚠ .x has changed. Looking for mathcing result to save them as cache

    ◌ Cache updated based on the new .x values

    |███████████████████████████████████████████████████████████████████████████████████████ | 2% ETA:  41 sec                         
    |█████████████████████████████████████████████████████████████████████████████████████ | 6% ETA:  40 sec                         
    |████████████████████████████████████████████████████████████████████████████████████ | 8% ETA:  39 sec                         
    |███████████████████████████████████████████████████████████████████████████████████ | 10% ETA:  38 sec                         
    |██████████████████████████████████████████████████████████████████████████████████ | 12% ETA:  37 sec                         
    |████████████████████████████████████████████████████████████████████████████████ | 16% ETA:  36 sec                         
    |███████████████████████████████████████████████████████████████████████████████ | 18% ETA:  35 sec                         
    |██████████████████████████████████████████████████████████████████████████████ | 20% ETA:  34 sec                         
    |█████████████████████████████████████████████████████████████████████████████ | 22% ETA:  33 sec                         
    |████████████████████████████████████████████████████████████████████████████ | 24% ETA:  32 sec                         

    [[1]]
    [1] 116.8667

    [[2]]
    [1] 122.71

    [[3]]
    [1] 128.5533

``` r
tictoc::toc() # ~ 50:60 => 10 x 1 sec
```

    Partly modification: 10.546 sec elapsed

You can remove the cache files, if you want to reset the process (or
remove the already unnecessary files from your folder).

``` r
# only cache files for iris_mean
remove_currr_cache("iris_mean")

# all cache files
remove_currr_cache()
```

### Background process

This is another functionality that makes `currr` to be cool. Working in
RStudio you can set the `wait` parameter to 0-1/1+, define how many
iterations you want to wait, and then let R work on the remaining
iterations in the background, while you can work with the evaluated
ones. If wait \< 1, then it is interpreted as what proportion of the
iterations you want to wait. Whenever you recall the function, it will
return the already evaluated ones (use the `fill` parameter to specify
whether you want to get `NULL`s to the pending ones.)

``` r
options(currr.wait = 20, currr.fill = FALSE)
```

<img src="https://raw.githubusercontent.com/MarcellGranat/marcellgranat-website/main/static/currr/example2.gif" align="center" />

In the example above, you get your results, when 20 iterations are
evaluated, but the job in the background keeps running.
