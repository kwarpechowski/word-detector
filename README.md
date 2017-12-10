Użyto biblioteki 'natural' dla języka javascript - https://github.com/NaturalNode/natural
Użyto wszystkich danych z korpusu.

Polecenia:

1. `node parser.js` - parsuje korpus z katalogu `data` do pliku `result.json`
2. `node train.js` - trenuje  dane z pliku `result.json` do pliku 
3. `node test.js` - testuje i zwraca wyniki

```
prec 0.977515330456507
F1 0.9814160300991905
recall 1
```


4. `node liner2.js` przygotowuje plik tekstowy do webowego interfejsu liner2 - `liner.txt`
5. dane z pliku `liner.txt` nalezy uzyc w http://ws.clarin-pl.eu/ner.shtml. wynikowy xml zapisac do liner.xml
6. `node linerparser.js` - parsuje wynik z liner.xml oraz sprawdza wyniki z prezentowanym rozwiazaniem

```
0.532938564026647 - takich samych otagowan
```