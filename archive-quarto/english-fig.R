
oes_df <- map_df(2001:2022, ~ {
  folder_name <- ifelse(
    test = . > 2002, # may noted after '02
    yes = str_c("m", str_sub(., start = 3)), 
    no = str_sub(., start = 3)
  ) |> 
    str_c("data/oes", `...` = _, "nat/")
  
  list.files(folder_name, full.names = TRUE, pattern = "national") |> 
    readxl::read_excel() |> 
    mutate_all(as.character) |> 
    rename_all(str_to_lower) |> 
    rename_all(str_replace, pattern = "title", replacement = "titl") |> 
    rename_all(str_replace, pattern = "titl", replacement = "title") |> 
    mutate(
      year = .,
      time = lubridate::ymd(str_c(., "-05-01")),
      .before = 1
    )
}) |> 
  select(year, 1:9) |> 
  mutate(
    across(tot_emp:last_col(), as.numeric)
  )

occupations_translate_df <- tribble(
  ~English, ~Hungarian,
  "All", "Összesen",
  "Statisticians", "Statisztikusok",
  "Data scientists", "Adattudósok",
  "Management", "Menedzsment",
  "Legal", "Jogi",
  "Computer and mathematical", "Számítógépes és matematikai",
  "Healthcare practitioners and technical", "Egészségügyi gyakorlók és technikusok",
  "Architecture and engineering", "Építészet és mérnöki",
  "Business and financial operations", "Üzleti és pénzügyi műveletek",
  "Life, physical, and social science", "Élettudomány, fizikai és társadalomtudomány",
  "Arts, design, entertainment, sports, and media", "Művészet, dizájn, szórakozás, sport és média",
  "Educational instruction and library", "Oktatási instrukció és könyvtár",
  "Construction and extraction", "Építés és kitermelés",
  "Community and social service", "Közösségi és szociális szolgáltatások",
  "Installation, maintenance, and repair", "Telepítés, karbantartás és javítás",
  "Protective service", "Védelmi szolgáltatás",
  "Sales and related", "Értékesítés és kapcsolódó",
  "Office and administrative support", "Irodai és adminisztratív támogatás",
  "Production", "Termelés",
  "Transportation and material moving", "Szállítás és anyagmozgatás",
  "Farming, fishing, and forestry", "Mezőgazdaság, halászat és erdőgazdálkodás",
  "Personal care and service", "Személyes gondozás és szolgáltatás",
  "Building and grounds cleaning and maintenance", "Épület- és területtisztítás és karbantartás",
  "Healthcare support", "Egészségügyi támogatás",
  "Food preparation and serving related", "Ételkészítés és felszolgálás kapcsolódó"
)

oes_df |> 
  filter(str_sub(occ_code, start = -4) == "0000" | occ_code == "15-2041" | occ_code == "15-2051") |> 
  filter(year %in% c(2009, 2022)) |> 
  mutate(
    occ_title = last(occ_title),
    occ_title = str_to_sentence(occ_title) |> 
      str_remove(" occupations"),
    increase = last(h_mean) / first(h_mean) - 1,
    increase = ifelse(!duplicated(occ_code), NA, increase),
    increase = scales::percent(increase),
    increase = str_c("+", increase),
    .by = occ_code
  ) |> 
  left_join(
    y = occupations_translate_df,
    by = join_by(occ_title == English)
  ) |> 
  mutate(
    ord = case_when(
      occ_title == "All" ~ 200,
      occ_title == "Statisticians" ~ 100,
      occ_title == "Data scientists" ~ 95,
      .default = h_mean
    ),
    occ_title = Hungarian,
    occ_title = case_when(
      ord > 70 ~ str_c("<b style='color:#02294c'>", occ_title, "</b>"),
      .default = occ_title
    ),
    occ_title = fct_reorder(occ_title, ord, .fun = max)
  ) |> 
  ggplot() + 
  geom_segment(
    mapping = aes(
      x = min(h_mean) - 5,
      xend = max(h_mean) + 10,
      y = occ_title,
      yend = occ_title,
      alpha = as.character(as.numeric(occ_title) %% 2)
    ), show.legend = FALSE, color = "grey", size = 4.5
  ) +
  scale_alpha_manual(values = c(.05, .1)) +
  geom_line(aes(y = occ_title, x = h_mean)) +
  geom_point(
    mapping = aes(h_mean, occ_title, fill = as.factor(year)), 
    size = 3,
    shape = 21,
    color = "black"
  ) + 
  theme(
    axis.text.y = element_markdown(margin = unit(c(0, -4, 0, 0), "pt")),
    panel.grid.major.y = element_blank(),
    panel.grid.major.x = element_line(linetype = 2),
    panel.grid.minor.x = element_line(linetype = 2),
    panel.border = element_blank(),
    axis.ticks = element_blank()
  ) + 
  labs(
    x = "Average hourly wage ($)",
    y = NULL,
    fill = "Year"
  )