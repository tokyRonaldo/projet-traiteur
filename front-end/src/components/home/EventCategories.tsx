// src/components/home/EventCategories.tsx
import CategoryCard from '../ui/CategoryCard';

const categories = [
  {
    title: "Weddings",
    description: "Make your big day delicious",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwPAT9yZLdtxIyZlQPNrWSjyxFgZ4vAgRRMTxxaxVZcnpSR7wcryxfwgisz2MLqIGP77kzxTYR0f1CWGYXyXJrDWEQibvIt1Jhpf_79_k06YsYSOkqDwr6OKaNbGMhQo7qf4e7NvoQXMKCLXrSBKXiuLFlT6ggohajrOUyIkGIX4-6kBCuFcxZiJJCzcia-dZf4m6kDVTCHDtrkT3RmHq2117gRs7vmcUxU_ySTXTDlFGG0MhbvrwU64hhdh92ewl6j-TdNFaKY27j",
  },
  {
    title: "Corporate",
    description: "Impress your clients & team",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCU6gRM_2y_DNF8Yh8Z4vlrDr94cBb3hrwXVPEEaW7gyH9NdGZsNnW3xto9fHupASb-VkChg-F1HNyuT-PPkaXybyPwLpFe8HH6w0vHAOs0UDd5gHONoxVi6v-0i43ySkZ8iYlclsNrk_5CXAwqcnVOX2_WiHKWOEJkiOZsGb8p3kjiiVUOfymKEB5MYUshH22XAQ0KGnj_3uehH8xc13SfqwQVtZCecz9e4Xxtvi-uVu5PQjmRUqjLqeeMsgVRNmhhfr0gdOIEU_7y",
  },
  {
    title: "Birthdays",
    description: "Celebrate with sweet flavors",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxjKR-K3ZQXJspjNdmP_meTWiH-kGxx3Q46AhpPL4yEW4LF-AyYhYjdICAFJr6bnbLfqAToYfTrNkduftN1wR_fL46i40bcn_Xezhi6QCYqVKQAtDuJX8J2R-eUmGTHsfEHamwDOyEQGSyqGMmyLEne_w1JexkvqnRD6T_a7QZvugkHARpZsQKmx5udQmriBwH4H1DmZAprVnqTB7vsjiVTHFtLdSU5NwYVswnZt_XBuoyKve_k6vUxxmro5mn4FY",
  },
  {
    title: "Private Parties",
    description: "Intimate gatherings made easy",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBko3X_dw2s1AIwNJvBih5UYG3CLoxL0TZwCqADYURM1c0xQAgknV6LQ3EseEUO8m63D2dcT4ovD23zt-NBC8taEGm2Ja7bWMI22EgHbpPt1JYFLOhOxx60JUw6G-IX2qY2Ymvf1EAd_EyLB8HBefqhNHy84GsPY7dfGxEVDMYfvc0vmo7CCasAxY7Fhrs75tlQM2bIgaAdM3wSw48bnpNEmT7KUOnO5F1DmSnFhyYdL_0pEhpM3Jg7wH1clP7Br_c5EGxJIklj_uE1",
  },
];

export default function EventCategories() {
  return (
    <section className="py-20 bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-16">Catering for Every Event</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <CategoryCard key={i} {...cat} />
          ))}
        </div>
      </div>
    </section>
  );
}