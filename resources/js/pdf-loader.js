var pdfLoader = function () {
    this.documentCache = { url: {}, pdf: {}, page: 0 };

    var self = this;

    this.init = function () {
        document.getElementById('pdf_next_page').addEventListener('click', function (evt) {
            self.nextPage();
            console.log('Next page clicked: ', evt.detail.intersection.point);
        });
        document.getElementById('pdf_previus_page').addEventListener('click', function (evt) {
            self.previusPage();
            console.log('Previus page clicked: ', evt.detail.intersection.point);
        });
        if (document.getElementById('pdfDialogOpener') != null)
            document.getElementById('pdfDialogOpener').addEventListener('click', function (evt) {
                //   self.loadUrl("resources/pdf/02_Mobile_Learning.pdf");
                //   console.log('pdf1 clicked: ', evt.detail.intersection.point);

                $.ajax(
                    {
                        url: "/api/get_files",
                        method: "GET",
                        success: function (response) {
                            $('#PDFLoaderDialog').attr("visible", "true");
                            $('#PDFLoaderDialog').attr("position", "-6.26 -0.3 -0.14");
                            if (response)
                                if (response.length > 0) {
                                    var iter = 1.4;
                                    for (const item in response) {
                                        if (response.hasOwnProperty(item)) {
                                            const element = response[item];
                                            //  $('#PDFLoaderDialog').append('<a-entity position = "0 ' + iter + '" 0" color="white" text="width: 3; value:' + element + '"></a-entity>');
                                            var el = $('<a-entity \
                                        position = "0 ' + iter + '" 0" \
                                        geometry = "primitive: plane; height: auto; width: auto" \
                                        material = "color: blue" \
                                        text = "width: 3; value: '+ element + '" > \
                                        event-sync \
                                        </a - entity > ');
                                            $('#PDFLoaderDialog').append(el);
                                            el[0].addEventListener('click', function () {
                                                self.loadUrl("/uploads/" + element);
                                            });
                                            iter -= 0.2;
                                        }
                                    }

                                }
                        }
                    }
                )
            });


        document.getElementById('play_button').addEventListener('click', function (evt) {
            document.querySelector('a-videosphere').setAttribute('visible', "true");
            document.querySelector('#WhiteBoard').setAttribute('visible', "false");
            document.querySelector('#island').setAttribute('visible', "false");
            document.querySelector('#pdf_next_page').setAttribute('visible', "false");
            document.querySelector('#pdf_previus_page').setAttribute('visible', "false");
            document.querySelector('#sky_entity').setAttribute('visible', "false");
            document.querySelector('#video_asset').play();
        });

        document.getElementById('stop_button').addEventListener('click', function (evt) {
            document.querySelector('a-videosphere').setAttribute('visible', "false");
            document.querySelector('#WhiteBoard').setAttribute('visible', "true");
            document.querySelector('#island').setAttribute('visible', "true");
            document.querySelector('#pdf_next_page').setAttribute('visible', "true");
            document.querySelector('#pdf_previus_page').setAttribute('visible', "true");
            document.querySelector('#sky_entity').setAttribute('visible', "true");

            document.querySelector('#video_asset').currentTime = 0;
            document.querySelector('#video_asset').stop();
        });

        document.getElementById('pause_button').addEventListener('click', function (evt) {
            document.querySelector('#video_asset').pause();
        });

        $("#upload_button").click(function (e) {
            // show upload hint
            document.querySelector("#uploadhint").setAttribute("position", "0 0 -2");
            window.setTimeout(function () { window.location.href = "/prepare_lesson.html"; }, 4000);
        });


    };

    this.loadUrl = function (url) {

        $('#PDFLoaderDialog').attr("visible", "false");
        $('#PDFLoaderDialog').attr("position", "-6.26 -3000 -0.14");

        if (ServerManager().is_server)
            NAF.connection.broadcastData("load_pdf", { url: url });

        // Asynchronous download PDF
        pdfjsLib.getDocument(url)
            .then(function (pdf) {
                self.documentCache.url = url;
                self.documentCache.pdf = pdf;
                self.documentCache.page = 1;
                return pdf.getPage(1);
            })
            .then(function (page) {
                // Set scale (zoom) level
                var scale = 1.5;

                // Get viewport (dimensions)
                var viewport = page.getViewport(scale);

                // Get canvas#the-canvas
                var canvas = document.getElementById('the-canvas');

                // Fetch canvas' 2d context
                var context = canvas.getContext('2d');

                // Set dimensions to Canvas
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Prepare object needed by render method
                var renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };

                // Render PDF page
                page.render(renderContext);
            });
    };

    this.nextPage = function () {
        self.documentCache.pdf.getPage(self.documentCache.page + 1).then(function (page) {
            //increment page in cache
            self.documentCache.page++;

            // Set scale (zoom) level
            var scale = 1.5;

            // Get viewport (dimensions)
            var viewport = page.getViewport(scale);

            // Get canvas#the-canvas
            var canvas = document.getElementById('the-canvas');

            // Fetch canvas' 2d context
            var context = canvas.getContext('2d');

            // Set dimensions to Canvas
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Prepare object needed by render method
            var renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            // Render PDF page
            page.render(renderContext);
        });
    };

    this.previusPage = function () {
        if (self.documentCache.page - 1 === 0)
            return;
        self.documentCache.pdf.getPage(self.documentCache.page - 1).then(function (page) {
            // decrement page in cache
            self.documentCache.page--;

            // Set scale (zoom) level
            var scale = 1.5;

            // Get viewport (dimensions)
            var viewport = page.getViewport(scale);

            // Get canvas#the-canvas
            var canvas = document.getElementById('the-canvas');

            // Fetch canvas' 2d context
            var context = canvas.getContext('2d');

            // Set dimensions to Canvas
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Prepare object needed by render method
            var renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            // Render PDF page
            page.render(renderContext);
        });
    };

    return this;
};
