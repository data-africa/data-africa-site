export const GLOSSARY = [
  {term: "poverty headcount ratio", definition: "The poverty headcount ratio measures the share of the population falling below a defined poverty line."},
  {term: "poverty gap ratio", definition: "The poverty gap index captures the depth of poverty (how far are the individuals from the poverty line), providing a more complete perspective with respect to the headcount ratio. The headcount ratio ignores the depth of poverty since someone living below the poverty line and becoming even poorer would leave the headcount value unchanged."},
  {term: "poverty severity ratio", definition: "The poverty severity index aims at refining the measure even more by taking into account the inequality among the poor by squaring the poverty gap ratio."},
  {term: "PPP", definition: "Purchasing power parity."},
  {term: "rainfall variability", definition: "A measure of how much rainfall varies from the annual average."},
  {term: "stunted", definition: "Below minus two standard deviations from median height for age of the given population."},
  {term: "underweight", definition: "Below minus two standard deviations from median weight for age of the given population."},
  {term: "wasted", definition: "Below minus two standard deviations from median weight for height of the given population."}
];

GLOSSARY.findTerm = function(term) {
  const obj = this.filter(obj => obj.term === term);
  return obj ? obj[0].definition : null;
};
