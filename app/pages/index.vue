<script lang="ts" setup>
import { ref } from "vue";
import { optimiserRemuneration } from "~/utils/optimiserRemuneration";

// Formulaire
const remunerationCible = ref(50000);
const salaireBrutMinimal = ref(12560);
const autresRevenus = ref(0);
const partsFiscales = ref(1);

// Valeurs suggérées pour le salaire brut minimal
const SUGGESTIONS = {
  PUMA: 12560,
  TRIMESTRES: 7128,
  IJ: 24117,
};

// Résultat du calcul
const resultat = ref<ReturnType<typeof optimiserRemuneration> | null>(null);

// Fonction pour calculer l'optimisation
const calculerOptimisation = () => {
  if (!remunerationCible.value || remunerationCible.value <= 0) {
    resultat.value = null;
    return;
  }
  resultat.value = optimiserRemuneration(
    remunerationCible.value,
    autresRevenus.value,
    partsFiscales.value,
    salaireBrutMinimal.value,
  );
};

// Formatage des nombres
const formatEuro = (montant: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(montant);
};

const formatPourcentage = (taux: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(taux);
};
</script>

<template>
  <div
    class="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-6xl mx-auto">
      <!-- En-tête -->
      <div class="text-center mb-12">
        <div class="flex items-center justify-center gap-3 mb-4">
          <h1 class="text-4xl font-bold text-gray-900">
            Optimisation de rémunération SASU
          </h1>
          <HelpTooltip>
            <p class="text-sm font-semibold mb-2">Principe de l'optimisation</p>
            <p class="text-sm text-gray-700">
              En SASU, vous pouvez vous rémunérer de deux façons :
            </p>
            <ul class="text-sm text-gray-700 mt-2 space-y-1">
              <li>
                • <strong>Salaire</strong> : Soumis à charges sociales élevées
                (67% au total) mais vous ouvre des droits sociaux
              </li>
              <li>
                • <strong>Dividendes</strong> : Soumis à l'IS (15-25%), CSG
                (17,2%) et IR (12,8% ou barème) mais pas de charges sociales
              </li>
            </ul>
            <p class="text-sm text-gray-700 mt-2">
              Cet outil calcule automatiquement la meilleure répartition entre
              salaire et dividendes pour minimiser vos prélèvements tout en
              respectant vos contraintes (salaire minimum pour vos droits
              sociaux).
            </p>
          </HelpTooltip>
        </div>
        <p class="text-lg text-gray-600">
          Trouvez la meilleure répartition entre salaire et dividendes pour
          minimiser vos prélèvements fiscaux et sociaux
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-8">
        <!-- Formulaire -->
        <UCard>
          <template #header>
            <h2 class="text-2xl font-bold">Vos paramètres</h2>
          </template>

          <form class="space-y-6" @submit.prevent>
            <!-- Rémunération cible -->
            <UFormField name="remuneration">
              <template #label>
                <div class="flex items-center gap-2">
                  <span>Rémunération cible nette d'impôts (€)</span>
                  <HelpTooltip>
                    <p class="text-sm font-semibold mb-2">
                      Rémunération nette d'impôts
                    </p>
                    <p class="text-sm text-gray-700">
                      Il s'agit de la rémunération que vous souhaitez percevoir
                      après déduction de tous les impôts et prélèvements
                      sociaux.
                    </p>
                    <p class="text-sm text-gray-700 mt-2">
                      L'outil calcule la meilleure répartition entre salaire et
                      dividendes pour atteindre ce montant net au moindre coût
                      pour votre SASU.
                    </p>
                  </HelpTooltip>
                </div>
              </template>
              <UInput
                v-model.number="remunerationCible"
                type="number"
                placeholder="50000"
              />
            </UFormField>

            <!-- Salaire brut minimal -->
            <UFormField name="salaire-min">
              <template #label>
                <div class="flex items-center gap-2">
                  <span>Salaire brut minimum annuel (€)</span>
                  <HelpTooltip>
                    <p class="text-sm font-semibold mb-2">Seuils importants</p>
                    <ul class="text-sm text-gray-700 space-y-2">
                      <li>
                        <strong>12 560 €</strong> : Pour éviter la cotisation
                        PUMA (Protection Universelle Maladie)
                      </li>
                      <li>
                        <strong>7 128 €</strong> : Pour valider 4 trimestres de
                        retraite (1 782 € par trimestre)
                      </li>
                      <li>
                        <strong>24 117 €</strong> : Pour bénéficier du taux
                        maximal d'indemnités journalières en cas de maladie
                      </li>
                    </ul>
                    <p class="text-sm text-gray-700 mt-2">
                      <strong>Charges appliquées au salaire :</strong>
                    </p>
                    <ul class="text-sm text-gray-700 mt-1 space-y-1">
                      <li>• Charges sociales (salariales) : 22%</li>
                      <li>• Charges patronales : 45%</li>
                    </ul>
                  </HelpTooltip>
                </div>
              </template>
              <UInput
                v-model.number="salaireBrutMinimal"
                type="number"
                placeholder="12560"
                class="mb-2"
              />
              <div class="flex flex-wrap gap-2 mt-2">
                <UButton
                  size="xs"
                  color="primary"
                  variant="soft"
                  @click="salaireBrutMinimal = SUGGESTIONS.PUMA"
                >
                  {{ formatEuro(SUGGESTIONS.PUMA) }} - Éviter PUMA
                </UButton>
                <UButton
                  size="xs"
                  color="success"
                  variant="soft"
                  @click="salaireBrutMinimal = SUGGESTIONS.TRIMESTRES"
                >
                  {{ formatEuro(SUGGESTIONS.TRIMESTRES) }} - Trimestres retraite
                </UButton>
                <UButton
                  size="xs"
                  color="secondary"
                  variant="soft"
                  @click="salaireBrutMinimal = SUGGESTIONS.IJ"
                >
                  {{ formatEuro(SUGGESTIONS.IJ) }} - Indemnités journalières
                </UButton>
              </div>
            </UFormField>

            <!-- Autres revenus -->
            <UFormField name="autres-revenus">
              <template #label>
                <div class="flex items-center gap-2">
                  <span>Autres revenus nets du foyer (€)</span>
                  <HelpTooltip>
                    <p class="text-sm font-semibold mb-2">
                      Autres revenus du foyer
                    </p>
                    <p class="text-sm text-gray-700">
                      Incluez ici tous les autres revenus nets perçus par votre
                      foyer fiscal (salaire du conjoint, revenus locatifs,
                      etc.).
                    </p>
                    <p class="text-sm text-gray-700 mt-2">
                      Ces revenus sont pris en compte pour le calcul de l'impôt
                      sur le revenu et peuvent influencer le choix entre PFU et
                      barème progressif pour les dividendes.
                    </p>
                  </HelpTooltip>
                </div>
              </template>
              <UInput
                v-model.number="autresRevenus"
                type="number"
                placeholder="0"
              />
            </UFormField>

            <!-- Parts fiscales -->
            <UFormField name="parts">
              <template #label>
                <div class="flex items-center gap-2">
                  <span>Nombre de parts fiscales</span>
                  <HelpTooltip>
                    <p class="text-sm font-semibold mb-2">Parts fiscales</p>
                    <p class="text-sm text-gray-700">
                      Le nombre de parts fiscales dépend de votre situation
                      familiale :
                    </p>
                    <ul class="text-sm text-gray-700 mt-2 space-y-1">
                      <li>• Célibataire : 1 part</li>
                      <li>• Couple : 2 parts</li>
                      <li>• +0,5 part par enfant (les 2 premiers)</li>
                      <li>• +1 part par enfant (à partir du 3ème)</li>
                    </ul>
                    <p class="text-sm text-gray-700 mt-2">
                      Les parts fiscales influencent directement le calcul de
                      l'impôt sur le revenu selon le barème progressif.
                    </p>
                  </HelpTooltip>
                </div>
              </template>
              <UInput
                v-model.number="partsFiscales"
                type="number"
                step="0.5"
                min="1"
                max="6"
                placeholder="1"
              />
            </UFormField>

            <!-- Bouton de calcul -->
            <UButton
              block
              size="lg"
              color="primary"
              icon="i-lucide-calculator"
              @click="calculerOptimisation"
            >
              Optimiser la rémunération
            </UButton>
          </form>
        </UCard>

        <!-- Résultats -->
        <UCard>
          <template #header>
            <h2 class="text-2xl font-bold">Répartition optimale</h2>
          </template>

          <div v-if="resultat" class="space-y-6">
            <!-- Métriques principales -->
            <div class="grid grid-cols-2 gap-4">
              <div
                class="bg-linear-to-br from-green-50 to-green-100 rounded-lg p-4"
              >
                <div class="text-sm text-green-800 font-medium mb-1">
                  Salaire brut
                </div>
                <div class="text-2xl font-bold text-green-900">
                  {{ formatEuro(resultat.salaireBrut) }}
                </div>
              </div>
              <div
                class="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-4"
              >
                <div class="text-sm text-blue-800 font-medium mb-1">
                  Dividendes brut
                </div>
                <div class="text-2xl font-bold text-blue-900">
                  {{ formatEuro(resultat.dividendesBrut) }}
                </div>
              </div>
            </div>

            <!-- Budget total -->
            <div
              class="bg-linear-to-br from-indigo-50 to-indigo-100 rounded-lg p-6 text-center"
            >
              <div class="flex items-center justify-center gap-2 mb-2">
                <div class="text-sm text-indigo-800 font-medium">
                  Budget total nécessaire
                </div>
                <HelpTooltip>
                  <p class="text-sm font-semibold mb-2">Budget total SASU</p>
                  <p class="text-sm text-gray-700">
                    C'est le montant total que votre SASU doit générer de
                    chiffre d'affaires (après déduction de toutes les autres
                    charges) pour vous verser la rémunération nette souhaitée.
                  </p>
                  <p class="text-sm text-gray-700 mt-2">
                    Il comprend : le salaire brut, les charges patronales, les
                    dividendes bruts, l'impôt sur les sociétés, la CSG sur
                    dividendes et l'impôt sur le revenu.
                  </p>
                </HelpTooltip>
              </div>
              <div class="text-3xl font-bold text-indigo-900">
                {{ formatEuro(resultat.budgetTotal) }}
              </div>
            </div>

            <!-- Détail des coûts -->
            <div class="border-t pt-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                Détail des coûts
              </h3>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-gray-600"
                      >Charges sociales patronales</span
                    >
                    <HelpTooltip>
                      <p class="text-sm font-semibold mb-2">
                        Charges patronales
                      </p>
                      <p class="text-sm text-gray-700">
                        <strong>Taux appliqué : 45%</strong> du salaire brut
                      </p>
                      <p class="text-sm text-gray-700 mt-2">
                        Ces charges comprennent les cotisations de sécurité
                        sociale, retraite, prévoyance, formation professionnelle
                        et autres contributions patronales obligatoires.
                      </p>
                    </HelpTooltip>
                  </div>
                  <span class="font-semibold text-gray-900">{{
                    formatEuro(resultat.chargesSocialesPatronales)
                  }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-gray-600"
                      >Impôt sur les sociétés</span
                    >
                    <HelpTooltip>
                      <p class="text-sm font-semibold mb-2">Barème IS 2026</p>
                      <ul class="text-sm text-gray-700 space-y-1">
                        <li>
                          • <strong>15%</strong> sur les 42 500 premiers € de
                          bénéfice (taux réduit)
                        </li>
                        <li>
                          • <strong>25%</strong> au-delà de 42 500 € (taux
                          normal)
                        </li>
                      </ul>
                      <p class="text-sm text-gray-700 mt-2">
                        L'IS est calculé sur le bénéfice de la société après
                        déduction du coût global du salaire (salaire brut +
                        charges patronales).
                      </p>
                    </HelpTooltip>
                  </div>
                  <span class="font-semibold text-gray-900">{{
                    formatEuro(resultat.impotSociete)
                  }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-gray-600"
                      >CSG sur dividendes</span
                    >
                    <HelpTooltip>
                      <p class="text-sm font-semibold mb-2">
                        CSG sur les dividendes
                      </p>
                      <p class="text-sm text-gray-700">
                        <strong>Taux appliqué : 17,2%</strong> des dividendes
                        bruts
                      </p>
                      <p class="text-sm text-gray-700 mt-2">
                        La CSG (Contribution Sociale Généralisée) et les autres
                        prélèvements sociaux s'appliquent sur les dividendes
                        distribués, quel que soit le régime fiscal choisi (PFU
                        ou barème progressif).
                      </p>
                    </HelpTooltip>
                  </div>
                  <span class="font-semibold text-gray-900">{{
                    formatEuro(resultat.csgDividendes)
                  }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-gray-600"
                      >Impôt sur le revenu ({{
                        resultat.optionDividendes
                      }})</span
                    >
                    <HelpTooltip>
                      <p class="text-sm font-semibold mb-2">
                        Impôt sur le revenu
                      </p>
                      <p class="text-sm text-gray-700 mb-2">
                        <strong>Barème progressif 2026 :</strong>
                      </p>
                      <ul class="text-sm text-gray-700 space-y-1">
                        <li>• 0% jusqu'à 11 497 €</li>
                        <li>• 11% de 11 497 € à 29 315 €</li>
                        <li>• 30% de 29 315 € à 83 823 €</li>
                        <li>• 41% de 83 823 € à 180 294 €</li>
                        <li>• 45% au-delà de 180 294 €</li>
                      </ul>
                      <p class="text-sm text-gray-700 mt-2">
                        <strong>Pour le salaire :</strong> Abattement de 10%
                        pour frais professionnels
                      </p>
                      <p class="text-sm text-gray-700 mt-2">
                        <strong>Pour les dividendes, 2 options :</strong>
                      </p>
                      <ul class="text-sm text-gray-700 space-y-1 mt-1">
                        <li>
                          • <strong>PFU</strong> (Prélèvement Forfaitaire
                          Unique) : 12,8% sur les dividendes bruts
                        </li>
                        <li>
                          • <strong>Barème progressif</strong> : Abattement de
                          40% sur les dividendes + barème ci-dessus
                        </li>
                      </ul>
                      <p class="text-sm text-gray-700 mt-2">
                        L'outil choisit automatiquement l'option la plus
                        avantageuse selon votre situation.
                      </p>
                    </HelpTooltip>
                  </div>
                  <span class="font-semibold text-gray-900">{{
                    formatEuro(resultat.impotRevenu)
                  }}</span>
                </div>
                <div class="border-t pt-3 flex justify-between items-center">
                  <span class="text-base font-semibold text-gray-900"
                    >Coût total</span
                  >
                  <span class="text-xl font-bold text-gray-900">{{
                    formatEuro(resultat.coutTotal)
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Rémunération nette finale -->
            <div
              class="bg-linear-to-br from-green-50 to-green-100 rounded-lg p-6 text-center border-2 border-green-200"
            >
              <div class="text-sm text-green-800 font-medium mb-2">
                Rémunération nette finale
              </div>
              <div class="text-3xl font-bold text-green-900">
                {{ formatEuro(resultat.remunerationNette) }}
              </div>
              <div class="flex items-center justify-center gap-2 mt-2">
                <div class="text-sm text-green-700">
                  Taux de prélèvement global :
                  {{ formatPourcentage(resultat.tauxPrelevementGlobal) }}
                </div>
                <HelpTooltip>
                  <p class="text-sm font-semibold mb-2">
                    Taux de prélèvement global
                  </p>
                  <p class="text-sm text-gray-700">
                    Ce taux représente la part totale de prélèvements (charges
                    sociales, impôts) par rapport au budget total nécessaire.
                  </p>
                  <p class="text-sm text-gray-700 mt-2">
                    <strong>Formule :</strong> (Budget total - Rémunération
                    nette) / Budget total
                  </p>
                  <p class="text-sm text-gray-700 mt-2">
                    Plus ce taux est faible, plus l'optimisation est efficace.
                    L'objectif est de minimiser ce taux tout en respectant vos
                    contraintes (salaire minimum, etc.).
                  </p>
                </HelpTooltip>
              </div>
            </div>
          </div>

          <div
            v-else
            class="flex items-center justify-center h-64 text-gray-400"
          >
            <div class="text-center">
              <svg
                class="mx-auto h-12 w-12 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <p>Renseignez les paramètres pour voir l'optimisation</p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Graphique Waterfall -->
      <UCard v-if="resultat" class="mt-8">
        <template #header>
          <h2 class="text-2xl font-bold">Visualisation de la répartition</h2>
        </template>
        <WaterfallChart
          :budget-total="resultat.budgetTotal"
          :salaire-brut="resultat.salaireBrut"
          :charges-sociales-patronales="resultat.chargesSocialesPatronales"
          :dividendes-brut="resultat.dividendesBrut"
          :impot-societe="resultat.impotSociete"
          :csg-dividendes="resultat.csgDividendes"
          :impot-revenu="resultat.impotRevenu"
          :remuneration-nette="resultat.remunerationNette"
        />
      </UCard>
    </div>
  </div>
</template>
