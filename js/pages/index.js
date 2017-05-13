var BlinkInterval = null; //Интервал мигания точек

function ViewModel() { //Представление данных и операций интерфейса
    var self = this;

    self.arr_original = ko.observableArray(); //Делаем привязку начальных данных. Пока они пустые

    self.CreateRandomArray = function () { //Функция генерации данных
        self.arr_original.removeAll(); //Очистим то что было
        var a = []; //Временный масив для данных
        for (var i = 0, l = 10; i < l; i++) { //Для задания взял 10 чисел для сортировки
            a.push(Math.round(Math.random() * l)); //Добавляем во временный массив
        }
        self.arr_original(a); //Заполняем массив данными, отобрадаем на экране
        $(".btn.sort").removeAttr("disabled"); //Теперь сортировка доступна
        $(".wrapper-sorted").empty(); //Очищаем контейнер с отсортированными данными (вдруг там что-то есть)
        $(".wrapper-original .element").clone().appendTo(".wrapper-sorted"); //Копируем оригинальный набор в контейнер для сортировки
        $("#static, #process").show(); //Показываем оба набора данных (оригинал + тот что будем сортировать)
        $("#process span.label").text("Данные для сортировки:");
    };

    self.BubbleSortStart = function () { //Общая функция запуска процесса сортировки
        $(".btn.create, .btn.sort").attr("disabled", true); //Делаем недоступными кнопки
        $("#process span.label").text("Сортировка данных");

        var i = 0;
        BlinkInterval = setInterval(function () { //Запускаем моркание точек. Каждые 500мс рисуем точки
            i++;
            if (i == 1) $(".dots").text(".");
            else if (i == 2) $(".dots").text("..");
            else if (i == 3) $(".dots").text("...");
            else {
                $(".dots").empty();
                i = 0;
            }
        }, 500);

        setTimeout(function () { //С задержкой запускаем сам процесс сортировки
            self.Swap(0, 0);
        }, 1000);
    };

    //Вместо двух циклов будем использовать рекурсию. j - аналог счетчика внутреннего цикла, i - аналог счетчика внешнего цикла
    self.Swap = function (i, j) { //Функция перемещения пары чисел.
        var e = $(".wrapper-sorted .element"); //Текущий набор элементов
        var n = e.length;
        if (j >= n - 1 - i) { //Аналог условия окончания внутреннего цикла.
            i++;
            j = 0;
        }

        if (i < n - 1) { //Аналог условия окончания внешнего цикла
            $(e[j + 1]).css("border", "1px solid #555"); //Рамка вокруг элементов которые обрабатываются
            $(e[j]).css("border", "1px solid #555"); //Рамка вокруг элементов которые обрабатываются

            setTimeout(function () { //Таймаут для наглядности перебора элеменов
                if (parseInt(e[j + 1].innerText) < parseInt(e[j].innerText)) { //Сравнение элементов. Если условие выполняется то перемещаем элементы
                    $.when( //Анимация перемещения
                        $(e[j + 1]).animate({right: 57}, 3000).promise(),
                        $(e[j]).animate({left: 57}, 3000).promise()
                    ).done(function () { //Ждем когда анимация закончится
                        $(e[j + 1]).removeAttr("style"); //Очищаем лишние атрибуты у эелемена после анимации (right + border)
                        $(e[j]).removeAttr("style"); //Очищаем лишние атрибуты у эелемена после анимации (left + border)

                        var t = e[j + 1]; //Временный элемент
                        e[j + 1] = e[j]; //Перемещение большего на место меньшего
                        e[j] = t; //Перемещение меньшего (Используем временный элемент) на место большего

                        $(".wrapper-sorted").empty(); //Очищаем контейнер
                        $(".wrapper-sorted").append(e); //Добавляем новый набор элементов
                        j++;
                        self.Swap(i, j); //Берем следующую пару элементов
                    });
                } else { //Перемещать элементы не нужно
                    $(e[j + 1]).removeAttr("style"); //Очищаем лишние атрибуты у эелемена после анимации (border)
                    $(e[j]).removeAttr("style"); //Очищаем лишние атрибуты у эелемена после анимации (border)
                    j++;
                    self.Swap(i, j); //Берем следующую пару элементов
                }
            }, 500);
        } else { //Перебрали все пары. Набор данный отсортирован
            clearInterval(BlinkInterval); //Очищаем интервал мигания точек
            $(".btn.create, .btn.sort").removeAttr("disabled"); //Делаем недоступными кнопки (Возможность повторить процесс).
            $("#process span.label").text("Отсортированый набор данных:");
            $(".dots").empty(); //Убиваем точки
            $("#process").fadeOut(500).fadeIn(500); //Промигиваем для наглядности. Сортировка окончена
        }
    };
};

ko.applyBindings(new ViewModel()); //Активируем Knockout