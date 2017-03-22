(function () {
    var WordMaze = WordMaze || {};

    WordMaze.Data = {
        "keyWords": ["CLETUS", "KRUSTY", "SMITHERS", "WILLIE", "CARL", "NELSON", "SIDESHOW BOB", "BART", "LENNY", "MOE", "MR BURNS", "HOMER", "PATTY", "OTTO", "APU", "RALPH", "BARNEY", "MARGE", "NED", "LISA"],
        "Maze": [
            ["Y", "R", "Y", "R", "H", "M", "R", "P", "Y", "O", "M", "U", "Y", "A"],
            ["L", "R", "S", "M", "O", "O", "C", "E", "T", "T", "C", "S", "T", "S"],
            ["N", "P", "H", "S", "M", "L", "T", "T", "U", "T", "A", "N", "T", "I"],
            ["E", "A", "I", "H", "E", "Y", "O", "P", "N", "S", "R", "R", "A", "D"],
            ["D", "H", "A", "T", "R", "E", "A", "P", "E", "O", "L", "U", "P", "E"],
            ["M", "H", "U", "M", "C", "N", "K", "B", "L", "A", "U", "B", "R", "S"],
            ["R", "S", "B", "L", "M", "R", "O", "E", "S", "U", "C", "R", "R", "H"],
            ["H", "A", "O", "A", "U", "A", "A", "E", "O", "A", "A", "M", "A", "O"],
            ["M", "W", "S", "S", "R", "B", "R", "S", "N", "P", "Y", "T", "L", "W"],
            ["O", "O", "T", "T", "R", "T", "I", "G", "I", "E", "R", "L", "P", "B"],
            ["E", "Y", "L", "M", "A", "R", "G", "E", "T", "L", "T", "E", "H", "O"],
            ["E", "O", "S", "E", "A", "W", "I", "L", "L", "I", "E", "N", "R", "B"],
            ["E", "R", "P", "U", "I", "S", "Y", "O", "T", "T", "E", "N", "R", "P"],
            ["O", "L", "S", "R", "E", "H", "T", "I", "M", "S", "A", "Y", "O", "I"]
        ]
    };

    WordMaze.App = (function () {
        "use strict";

        var startLocations = [];
        var endLocations = [];

        function getWordByLocation(startLocation, endLocation) {
            var word = WordMaze.Data.Maze[startLocation.row][startLocation.col];
            var wordLocations = [];
            wordLocations.push(startLocation.row + "-" + startLocation.col);
            var rows = endLocation.row - startLocation.row;
            var cols = endLocation.col - startLocation.col;
            var i;

            if (rows === 0 && cols !== 0) {
                for (i = 1; i < Math.abs(cols) ; i++) {
                    if (cols > 0) {
                        word = word + WordMaze.Data.Maze[startLocation.row][startLocation.col + i];
                        wordLocations.push(startLocation.row + "-" + (startLocation.col + i));
                    } else {
                        word = word + WordMaze.Data.Maze[startLocation.row][startLocation.col - i];
                        wordLocations.push(startLocation.row + "-" + (startLocation.col - i));
                    }
                }
            } else if (rows !== 0 && cols === 0) {
                for (i = 1; i < Math.abs(rows) ; i++) {
                    if (rows > 0) {
                        word = word + WordMaze.Data.Maze[startLocation.row + i][startLocation.col];
                        wordLocations.push(startLocation.row + i + "-" + startLocation.col);
                    } else {
                        word = word + WordMaze.Data.Maze[startLocation.row - i][startLocation.col];
                        wordLocations.push(startLocation.row - i + "-" + startLocation.col);
                    }
                }
            } else if (rows !== 0 && cols !== 0) {
                for (i = 1; i < Math.abs(rows) ; i++) {
                    if (rows > 0 && cols > 0) {
                        word = word + WordMaze.Data.Maze[startLocation.row + i][startLocation.col + i];
                        wordLocations.push(startLocation.row + i + "-" + (startLocation.col + i));
                    } else if (rows < 0 && cols > 0) {
                        word = word + WordMaze.Data.Maze[startLocation.row - i][startLocation.col + i];
                        wordLocations.push(startLocation.row - i + "-" + (startLocation.col + i));
                    } else if (rows > 0 && cols < 0) {
                        word = word + WordMaze.Data.Maze[startLocation.row + i][startLocation.col - i];
                        wordLocations.push(startLocation.row + i + "-" + (startLocation.col - i));
                    } else {
                        word = word + WordMaze.Data.Maze[startLocation.row - i][startLocation.col - i];
                        wordLocations.push(startLocation.row - i + "-" + (startLocation.col - i));
                    }
                }
            }

            word = word + WordMaze.Data.Maze[endLocation.row][endLocation.col];
            wordLocations.push(endLocation.row + "-" + endLocation.col);

            return {
                "Word": word,
                "WordLocations": wordLocations
            };
        }

        function findLetterLocations(letter) {
            startLocations = [];
            $.each(WordMaze.Data.Maze, function (rowIndex, rowData) {
                $.each(rowData, function (colIndex, cellData) {
                    if (cellData === letter)
                        startLocations.push({ "row": rowIndex, "col": colIndex });
                });
            });
        }

        function findLetterEndLocations(startLocation, wordLength) {
            endLocations = [];

            var right = startLocation.col + wordLength - 1;
            var left = startLocation.col - wordLength + 1;
            var up = startLocation.row - wordLength + 1;
            var down = startLocation.row + wordLength - 1;

            if (right <= 13) endLocations.push({ "row": startLocation.row, "col": right });
            if (left >= 0) endLocations.push({ "row": startLocation.row, "col": left });
            if (up >= 0) endLocations.push({ "row": up, "col": startLocation.col });
            if (down <= 13) endLocations.push({ "row": down, "col": startLocation.col });

            if (right <= 13 && down <= 13) endLocations.push({ "row": down, "col": right });
            if (right <= 13 && up >= 0) endLocations.push({ "row": up, "col": right });
            if (left >= 0 && down <= 13) endLocations.push({ "row": down, "col": left });
            if (left >= 0 && up >= 0) endLocations.push({ "row": up, "col": left });
        }

        function SearchKeyWord(keyWord) {
            var answer;
            var firstLetter = keyWord.split("")[0];
            findLetterLocations(firstLetter);

            $.each(startLocations, function (sIndex, startLocation) {
                findLetterEndLocations(startLocation, keyWord.length);
                $.each(endLocations, function (eIndex, endLocation) {
                    var searchResult = getWordByLocation(startLocation, endLocation);
                    if (searchResult.Word === keyWord) {
                        answer = searchResult.WordLocations;
                    }
                });
            });

            return answer;
        }

        return {
            SearchKeyWord: SearchKeyWord
        };
    })();

    WordMaze.Ui = (function () {
        "use strict";
        const mazeTable = $("#mazeTable");
        const dropDownList = $("#dropDownList");
        const orderedList = $("#keyWordList");
        const dropDownSelector = $("#dropDownSelector");
        const btnSubmit = $("#btnSubmit");
        const btnReset = $("#btnReset");

        // public function
        function CreateWordMaze() {
            CreateComponents();
            AddEventListeners();
        }

        // private function
        function CreateComponents() {
            $.each(WordMaze.Data.keyWords, function (index, item) {
                const listItem = $("<li>", { html: item });
                orderedList.append(listItem);
                dropDownList.append($("<li>", { html: "<a><span>" + item + "</span></a>" }));
            });

            $.each(WordMaze.Data.Maze, function (rowIndex, rowData) {
                var row = $("<tr>", { id: rowIndex });
                $.each(rowData,
                    function (colIndex, cellData) {
                        const cell = $("<td>", { id: rowIndex + "-" + colIndex, html: cellData });
                        row.append(cell);
                    });
                mazeTable.append(row);
            });
        }

        // private function
        function AddEventListeners() {
            mazeTable.on("click", "tr td", function () {
                $(this).toggleClass("selected");
            });

            dropDownList.on("click", "li a", function () {
                dropDownSelector.text($(this).text());
                dropDownSelector.val($(this).text());
            });

            btnSubmit.on("click", function () {
                var searchKeyword = dropDownSelector.val().replace(/ /g, '');
                var cells = WordMaze.App.SearchKeyWord(searchKeyword);
                $.each(cells, function (cellIndex, cellId) {
                    $("#" + cellId).addClass("highlight");
                });
            });

            btnReset.on("click", function () {
                mazeTable.find("td").removeClass("highlight selected");
            });
        }

        return {
            GetWordSearchPuzzle: CreateWordMaze
        };
    })();

    WordMaze.Ui.GetWordSearchPuzzle();
})();