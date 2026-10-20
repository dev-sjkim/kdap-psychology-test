// 단어와 해석의 바탕이 된 문헌. DOI는 Crossref에서 확인했다.
// 이 앱은 아래 연구를 참고해 만든 가벼운 활동이며, 검증된 척도로 실시하는 검사는 아니다.

export interface Reference {
  id: string;
  short: string;
  citation: string;
  doi?: string;
  url?: string;
  usedForKo: string;
}

export const REFERENCES: Reference[] = [
  {
    id: "donnellan2006",
    short: "Donnellan et al. (2006)",
    citation:
      "Donnellan, M. B., Oswald, F. L., Baird, B. M., & Lucas, R. E. (2006). The Mini-IPIP scales: Tiny-yet-effective measures of the Big Five factors of personality. Psychological Assessment, 18(2), 192–203.",
    doi: "10.1037/1040-3590.18.2.192",
    usedForKo: "성격 5지선다 문항. Mini-IPIP 20문항 중 10문항을 골라 썼다(IPIP 문항은 퍼블릭 도메인)",
  },
  {
    id: "schwartz1992",
    short: "Schwartz (1992)",
    citation:
      "Schwartz, S. H. (1992). Universals in the content and structure of values: Theoretical advances and empirical tests in 20 countries. Advances in Experimental Social Psychology, 25, 1–65.",
    doi: "10.1016/S0065-2601(08)60281-6",
    usedForKo: "10가지 기본가치. 가치 단어를 고를 때 참고",
  },
  {
    id: "schwartz2012",
    short: "Schwartz (2012)",
    citation: "Schwartz, S. H. (2012). An overview of the Schwartz theory of basic values. Online Readings in Psychology and Culture, 2(1).",
    doi: "10.9707/2307-0919.1116",
    usedForKo: "가치 정의와 상위 4차원",
  },
  {
    id: "miller2001_pvcs",
    short: "Miller et al. (2001)",
    citation: "Miller, W. R., C'de Baca, J., Matthews, D. B., & Wilbourne, P. L. (2001). Personal Values Card Sort. University of New Mexico.",
    url: "https://casaa.unm.edu/assets/inst/personal-values-card-sort.pdf",
    usedForKo: "고르고 덜어내며 가치를 정리하는 카드 소트 방식(퍼블릭 도메인)",
  },
];
