# Grant Risk Calculation

## Risk for fresh and ongoing grant from Question answers.

 * For the individual risk types we calcuate the individual risk value from the answers to the question.
 * We have 4 Risk Types:

       * Performance Risks
       * Financial Risks
       * Quality Risks
       * Compliance Risks
 * [Here](https://rapventures-my.sharepoint.com/:x:/g/personal/gk_padmashali_rap_ventures/ERhI281NJYhDtAjW0jEXJm8BoGyRUzVI1QMGJKamNdFLgg?e=EsIkKC) is the link to the questions.

 * We have assigned each questions and answer impact values. And a probality percentage corresponding to each questions (i-e Likelyhood of occurrence of the incident). 
     ```
        How we find the Risk:
                We Calculate the risk by summing up the impact of the question and impact of the answer multiplied by the probality. Then we sum up all the risk of all the question within the individual risk type to get the risk value of that risk type. 

        Where 
            iQ -> Impact of the Question
            iA -> Impact of the Answer
            pQ -> Probality of occurance
            r -> Risk Score of the Question
            R -> Risk Score of the Risk Type
            r = (iQ + iA) * pQ
            R = Σ rᵢ , Where i represents the set of questions

 * Calculate the overall risk from risk score of each risk type.
 ```
    1. Simple arithmetic summation of the risk scores of each risk type.

    Where:
        R -> Risk Score of the Risk Type
        SR -> Total Risk Score
        SR = Σ Rᵢ , Where i represents the set of Risk types
```
```
    2. Weighted summation of the risk scores of each risk type.

    Where:

        R -> Risk Score of the Risk Type
        W -> Weightage of the Risk Type
        SR -> Total Risk Score
        SR = Σ (Rᵢ* Wᵢ) , Where i represents the set of Risk types
```
 * How to combine overall risk score of SAF and Risk Types (Question)?

    1. Simple arithmetic summation of the risk scores from SAF and Risk Types.
    2. Weighted summation of the risk scores from SAF and Risk Types.

## Risk for ongoing grant from SAF.

 * For the risk for ongoing grant from SAF we calculate the risk from the logic outlined [Here](https://rapventures-my.sharepoint.com/:x:/g/personal/gk_padmashali_rap_ventures/EZfoeRKrsCFGjuXpGov5qBgBC0DpVpewSITP0WKlo12zUg?e=dsyo4V).
