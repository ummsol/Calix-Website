$(function () {
    "use strict";

    const productName = $(".product-info h2").first().text().trim();
    const category = $(".product-info small").first().text().trim();
    const imageSrc = $("[data-product-media]").data("referenceSrc") || "";
    const imageFile = String(imageSrc).split("/").pop();
    const catalogItem = CalixApp.PRODUCT_CATALOG[productName] || {};
    const modelPreviewFile = catalogItem.modelPreviewFile || "";
    const startingPrice = Number(catalogItem.startingPrice) || 0;

    const productSpecs = {
        "Sliding Glass Door": {
            badges: ["Made to order", "Custom sizes", "Site measurement required"],
            sizes: ["1500 × 2100 mm", "1800 × 2100 mm", "2400 × 2100 mm", "Custom size"],
            materials: ["6 mm clear glass", "6 mm tinted glass", "10 mm tempered glass", "Custom glass option"],
            finishes: ["Powder-coated black", "Analok", "Wood finish", "Custom finish"],
            bestFor: "Patios, balconies, room dividers, storefront openings, and wide openings that need a smooth sliding action.",
            notes: [
                "Final width, height, panel arrangement, and track requirement are confirmed during site measurement.",
                "Handle, lock, drainage, and installation condition are finalized before fabrication.",
                "Design and layout may vary per contract agreement."
            ],
            appearance: {
                finishLabel: "Frame finish",
                finishOptions: [
                    { key: "black", label: "Powder-coated Black", value: "Powder-coated black", hex: "#34393d" },
                    { key: "analok", label: "Analok", value: "Analok", hex: "#b1b7bc" },
                    { key: "wood", label: "Wood finish", value: "Wood finish", hex: "#8a603d" },
                    { key: "white", label: "White", value: "Custom finish", hex: "#eceff1" }
                ],
                glassLabel: "Glass look",
                glassOptions: [
                    { key: "clear", label: "Clear", value: "6 mm clear glass" },
                    { key: "tinted", label: "Tinted", value: "6 mm tinted glass" },
                    { key: "tempered", label: "Tempered", value: "10 mm tempered glass" },
                    { key: "frosted", label: "Frosted", value: "Custom glass option" }
                ]
            }
        },
        "Glass Window": {
            badges: ["Made to order", "Custom glazing", "Ventilation ready"],
            sizes: ["600 × 600 mm", "900 × 1200 mm", "1200 × 1200 mm", "Custom size"],
            materials: ["6 mm clear glass", "6 mm tinted glass", "6 mm frosted glass", "Custom glass option"],
            finishes: ["Powder-coated black", "Analok", "White", "Custom finish"],
            bestFor: "Bedrooms, kitchens, offices, utility areas, and everyday openings that need daylight and practical ventilation.",
            notes: [
                "Opening direction and glazing preference are confirmed during quotation.",
                "Privacy, heat-control, or visibility requirements affect the final glass choice.",
                "Design and layout may vary per contract agreement."
            ],
            appearance: {
                finishLabel: "Frame finish",
                finishOptions: [
                    { key: "black", label: "Powder-coated Black", value: "Powder-coated black", hex: "#34393d" },
                    { key: "analok", label: "Analok", value: "Analok", hex: "#b1b7bc" },
                    { key: "white", label: "White", value: "White", hex: "#eef1f3" },
                    { key: "bronze", label: "Bronze", value: "Custom finish", hex: "#7d5a42" }
                ],
                glassLabel: "Glass look",
                glassOptions: [
                    { key: "clear", label: "Clear", value: "6 mm clear glass" },
                    { key: "tinted", label: "Tinted", value: "6 mm tinted glass" },
                    { key: "frosted", label: "Frosted", value: "6 mm frosted glass" },
                    { key: "tempered", label: "Tempered", value: "Custom glass option" }
                ]
            }
        },
        "Aluminum Door": {
            badges: ["Made to order", "Mixed panel options", "Interior or exterior use"],
            sizes: ["800 × 2100 mm", "900 × 2100 mm", "1000 × 2100 mm", "Custom size"],
            materials: ["Clear glass insert", "Frosted glass insert", "Solid aluminum panel", "Custom panel option"],
            finishes: ["Powder-coated black", "Analok", "White", "Wood finish"],
            bestFor: "Residential entries, service areas, office rooms, and durable openings that need a practical aluminum build.",
            notes: [
                "Door swing, hinge side, lockset, and panel combination are finalized before fabrication.",
                "Screen and louver arrangement can vary based on the final approved layout.",
                "Design and layout may vary per contract agreement."
            ],
            appearance: {
                finishLabel: "Main finish",
                finishOptions: [
                    { key: "black", label: "Powder-coated Black", value: "Powder-coated black", hex: "#34393d" },
                    { key: "analok", label: "Analok", value: "Analok", hex: "#b1b7bc" },
                    { key: "white", label: "White", value: "White", hex: "#eef1f3" },
                    { key: "wood", label: "Wood finish", value: "Wood finish", hex: "#8a603d" }
                ],
                glassLabel: "Panel look",
                glassOptions: [
                    { key: "clear", label: "Clear insert", value: "Clear glass insert" },
                    { key: "frosted", label: "Frosted insert", value: "Frosted glass insert" },
                    { key: "whiteglass", label: "Solid panel", value: "Solid aluminum panel" },
                    { key: "tinted", label: "Tinted insert", value: "Custom panel option" }
                ]
            }
        },
        "Glass Stair Railing": {
            badges: ["Made to order", "Measured on site", "Hardware customizable"],
            sizes: ["900 mm rail height", "1000 mm rail height", "1100 mm rail height", "Custom measurement"],
            materials: ["10 mm tempered glass", "12 mm tempered glass", "Laminated glass", "Custom glass option"],
            finishes: ["Stainless hardware", "Black hardware", "Aluminum channel", "Custom hardware"],
            bestFor: "Stairs, landings, mezzanines, and interiors that need safety without visually closing the space.",
            notes: [
                "Glass sizing is based on the actual stair angle and mounting condition.",
                "Posts, channels, clamps, handrails, and wood or steel support conditions are reviewed on site.",
                "Design and layout may vary per contract agreement."
            ],
            appearance: {
                finishLabel: "Hardware finish",
                finishOptions: [
                    { key: "stainless", label: "Stainless", value: "Stainless hardware", hex: "#b5bcc1" },
                    { key: "black", label: "Black hardware", value: "Black hardware", hex: "#2f3436" },
                    { key: "analok", label: "Aluminum channel", value: "Aluminum channel", hex: "#c4c9cd" },
                    { key: "wood", label: "Warm wood tone", value: "Custom hardware", hex: "#8d603d" }
                ],
                glassLabel: "Glass look",
                glassOptions: [
                    { key: "clear", label: "Clear", value: "10 mm tempered glass" },
                    { key: "tinted", label: "Tinted", value: "Custom glass option" },
                    { key: "laminated", label: "Laminated", value: "Laminated glass" },
                    { key: "frosted", label: "Frosted", value: "12 mm tempered glass" }
                ]
            }
        },
        "Frameless Shower Enclosure": {
            badges: ["Made to order", "Tempered glass", "Bathroom layout required"],
            sizes: ["800 × 2000 mm", "900 × 2000 mm", "1200 × 2000 mm", "Custom size"],
            materials: ["10 mm clear tempered glass", "10 mm frosted tempered glass", "12 mm clear tempered glass", "Custom glass option"],
            finishes: ["Chrome hardware", "Matte black hardware", "Brushed finish", "Custom hardware"],
            bestFor: "Bathrooms that need a clean wet-area enclosure while keeping the room visually open and bright.",
            notes: [
                "Door swing, support bar, hinge location, and fixed-panel layout are based on the final bathroom condition.",
                "Tempered glass sizing is finalized only after finished tile surfaces are measured.",
                "Design and layout may vary per contract agreement."
            ],
            appearance: {
                finishLabel: "Hardware finish",
                finishOptions: [
                    { key: "chrome", label: "Chrome", value: "Chrome hardware", hex: "#c7ccd1" },
                    { key: "matteblack", label: "Matte black", value: "Matte black hardware", hex: "#34393d" },
                    { key: "brushed", label: "Brushed", value: "Brushed finish", hex: "#b8b0a4" },
                    { key: "stainless", label: "Stainless", value: "Custom hardware", hex: "#afb6ba" }
                ],
                glassLabel: "Glass look",
                glassOptions: [
                    { key: "clear", label: "Clear", value: "10 mm clear tempered glass" },
                    { key: "frosted", label: "Frosted", value: "10 mm frosted tempered glass" },
                    { key: "tempered", label: "Extra tempered", value: "12 mm clear tempered glass" },
                    { key: "tinted", label: "Tinted", value: "Custom glass option" }
                ]
            }
        },
        "Frosted Sliding Door": {
            badges: ["Made to order", "Privacy-focused", "Custom panel layout"],
            sizes: ["900 × 2100 mm", "1200 × 2100 mm", "1800 × 2100 mm", "Custom size"],
            materials: ["6 mm frosted glass", "6 mm white glass", "Tempered frosted glass", "Custom panel option"],
            finishes: ["Wood finish", "Powder-coated black", "Analok", "Custom finish"],
            bestFor: "Bedrooms, closets, kitchens, offices, and partitions that need privacy without using a solid wall.",
            notes: [
                "Panel count, frame division, sliding direction, and wall clearance depend on the approved opening.",
                "Frost level and frame finish are confirmed during quotation.",
                "Design and layout may vary per contract agreement."
            ],
            appearance: {
                finishLabel: "Frame finish",
                finishOptions: [
                    { key: "wood", label: "Wood finish", value: "Wood finish", hex: "#8a603d" },
                    { key: "black", label: "Powder-coated Black", value: "Powder-coated black", hex: "#34393d" },
                    { key: "analok", label: "Analok", value: "Analok", hex: "#b1b7bc" },
                    { key: "white", label: "White", value: "Custom finish", hex: "#edf0f2" }
                ],
                glassLabel: "Panel look",
                glassOptions: [
                    { key: "frosted", label: "Frosted", value: "6 mm frosted glass" },
                    { key: "whiteglass", label: "White glass", value: "6 mm white glass" },
                    { key: "tempered", label: "Tempered frosted", value: "Tempered frosted glass" },
                    { key: "clear", label: "Semi-clear", value: "Custom panel option" }
                ]
            }
        },
        "Black Aluminum Sliding Door": {
            badges: ["Made to order", "Large opening ready", "Modern facade look"],
            sizes: ["1500 × 2100 mm", "1800 × 2100 mm", "2400 × 2100 mm", "Custom size"],
            materials: ["6 mm clear glass", "6 mm tinted glass", "10 mm tempered glass", "Custom glass option"],
            finishes: ["Powder-coated black", "Matte black", "Textured black", "Custom finish"],
            bestFor: "Modern residential openings, balconies, patios, offices, and commercial spaces that use dark architectural framing.",
            notes: [
                "Panel arrangement, locking points, and drainage requirements depend on the final installation condition.",
                "Finish sample can be matched to nearby architectural elements.",
                "Design and layout may vary per contract agreement."
            ],
            appearance: {
                finishLabel: "Frame finish",
                finishOptions: [
                    { key: "black", label: "Powder-coated Black", value: "Powder-coated black", hex: "#2f3438" },
                    { key: "matteblack", label: "Matte black", value: "Matte black", hex: "#24282b" },
                    { key: "texturedblack", label: "Textured black", value: "Textured black", hex: "#3b4044" },
                    { key: "bronze", label: "Bronze", value: "Custom finish", hex: "#6f5945" }
                ],
                glassLabel: "Glass look",
                glassOptions: [
                    { key: "clear", label: "Clear", value: "6 mm clear glass" },
                    { key: "tinted", label: "Tinted", value: "6 mm tinted glass" },
                    { key: "tempered", label: "Tempered", value: "10 mm tempered glass" },
                    { key: "frosted", label: "Frosted", value: "Custom glass option" }
                ]
            }
        },
        "Awning Window": {
            badges: ["Made to order", "Top-hinged ventilation", "Compact-space friendly"],
            sizes: ["600 × 600 mm", "600 × 900 mm", "900 × 900 mm", "Custom size"],
            materials: ["6 mm clear glass", "6 mm tinted glass", "6 mm frosted glass", "Custom glass option"],
            finishes: ["Powder-coated black", "Analok", "White", "Custom finish"],
            bestFor: "Bathrooms, kitchens, utility rooms, and compact spaces that need controlled ventilation from a top-hinged sash.",
            notes: [
                "Opening clearance, hinge type, and operator position are checked during site measurement.",
                "Glass privacy level can be matched to the room condition.",
                "Design and layout may vary per contract agreement."
            ],
            appearance: {
                finishLabel: "Frame finish",
                finishOptions: [
                    { key: "black", label: "Powder-coated Black", value: "Powder-coated black", hex: "#34393d" },
                    { key: "analok", label: "Analok", value: "Analok", hex: "#b1b7bc" },
                    { key: "white", label: "White", value: "White", hex: "#eef1f3" },
                    { key: "bronze", label: "Bronze", value: "Custom finish", hex: "#7d5a42" }
                ],
                glassLabel: "Glass look",
                glassOptions: [
                    { key: "clear", label: "Clear", value: "6 mm clear glass" },
                    { key: "tinted", label: "Tinted", value: "6 mm tinted glass" },
                    { key: "frosted", label: "Frosted", value: "6 mm frosted glass" },
                    { key: "tempered", label: "Tempered", value: "Custom glass option" }
                ]
            }
        },
        "Sliding Aluminum Window": {
            badges: ["Made to order", "Practical ventilation", "Window screen ready"],
            sizes: ["900 × 900 mm", "1200 × 1200 mm", "1500 × 1200 mm", "Custom size"],
            materials: ["6 mm clear glass", "6 mm tinted glass", "6 mm frosted glass", "Custom glass option"],
            finishes: ["Powder-coated black", "Analok", "White", "Custom finish"],
            bestFor: "Homes, offices, and commercial spaces that need simple horizontal ventilation and durable aluminum framing.",
            notes: [
                "Panel count, screen requirement, and lock type are confirmed during quotation.",
                "Final opening dimensions are taken on site before fabrication.",
                "Design and layout may vary per contract agreement."
            ],
            appearance: {
                finishLabel: "Frame finish",
                finishOptions: [
                    { key: "black", label: "Powder-coated Black", value: "Powder-coated black", hex: "#34393d" },
                    { key: "analok", label: "Analok", value: "Analok", hex: "#b1b7bc" },
                    { key: "white", label: "White", value: "White", hex: "#eef1f3" },
                    { key: "bronze", label: "Bronze", value: "Custom finish", hex: "#7d5a42" }
                ],
                glassLabel: "Glass look",
                glassOptions: [
                    { key: "clear", label: "Clear", value: "6 mm clear glass" },
                    { key: "tinted", label: "Tinted", value: "6 mm tinted glass" },
                    { key: "frosted", label: "Frosted", value: "6 mm frosted glass" },
                    { key: "tempered", label: "Tempered", value: "Custom glass option" }
                ]
            }
        }
    };

    const spec = productSpecs[productName] || {
        badges: ["Made to order", "Customizable", "Site measurement required"],
        sizes: ["Standard size", "Custom size"],
        materials: ["Standard material", "Custom material"],
        finishes: ["Standard finish", "Custom finish"],
        bestFor: "Residential and commercial applications based on the final project requirement.",
        notes: [
            "Final dimensions are confirmed during site measurement.",
            "Material and hardware selections are finalized during quotation.",
            "Design and layout may vary per contract agreement."
        ],
        appearance: {
            finishLabel: "Main finish",
            finishOptions: [
                { key: "black", label: "Black", value: "Standard finish", hex: "#34393d" },
                { key: "white", label: "White", value: "Custom finish", hex: "#eef1f3" }
            ],
            glassLabel: "Glass / panel look",
            glassOptions: [
                { key: "clear", label: "Clear", value: "Standard material" },
                { key: "frosted", label: "Frosted", value: "Custom material" }
            ]
        }
    };

    function makeList(items) {
        const $list = $("<ul>", { class: "product-spec-list" });
        items.forEach((item) => $list.append($("<li>").text(item)));
        return $list;
    }

    function renderFinishOptions(items) {
        const $group = $('<div class="appearance-group" data-appearance-group="finish"></div>');
        items.forEach((item, index) => {
            const $button = $('<button>', {
                type: 'button',
                class: `appearance-swatch${index === 0 ? ' is-active' : ''}`,
                'data-model-finish': item.key,
                'data-option-value': item.value,
                'aria-pressed': index === 0 ? 'true' : 'false',
                'aria-label': item.label,
                css: { '--swatch': item.hex }
            });
            $button.append('<span class="appearance-swatch-chip" aria-hidden="true"></span>');
            $button.append($('<span>', { class: 'appearance-swatch-text', text: item.label }));
            $group.append($button);
        });
        return $group;
    }

    function renderGlassOptions(items) {
        const $group = $('<div class="appearance-group appearance-group-pills" data-appearance-group="glass"></div>');
        items.forEach((item, index) => {
            $group.append($("<button>", {
                type: "button",
                class: `appearance-pill${index === 0 ? ' is-active' : ''}`,
                'data-model-glass': item.key,
                'data-option-value': item.value,
                'aria-pressed': index === 0 ? 'true' : 'false',
                text: item.label
            }));
        });
        return $group;
    }

    const $badgeRow = $('<div class="product-status-row" aria-label="Product quick facts"></div>');
    spec.badges.forEach((badge) => {
        $badgeRow.append($('<span class="product-status-pill"></span>').text(badge));
    });
    $(".product-info > p.product-price")
        .text(startingPrice ? `Starting estimate ${CalixApp.formatCurrency(startingPrice)}*` : "Price upon quotation")
        .after($badgeRow);

    if (startingPrice) {
        $badgeRow.after(
            $('<p class="product-price-disclaimer"></p>').text(
                "*Planning estimate only. Final price may vary per contract agreement, approved specifications, site measurement, materials, hardware, and installation conditions."
            )
        );
    }

    const $customPanel = $(
        '<section class="product-customization-panel" aria-labelledby="customizationHeading"><div class="section-heading-block"><h3 id="customizationHeading">Customization Preview</h3><p class="section-helper-copy">Preview your preferred finish and glass or panel look before adding the product to your quote. Design and layout may vary per contract agreement.</p></div></section>'
    );

    const $finishField = $('<div class="customization-field"></div>').append(
        $('<div class="customization-field-head"></div>').append(
            $('<span class="customization-label"></span>').text(spec.appearance.finishLabel),
            $('<strong class="customization-selected" data-selected-finish></strong>').text(spec.appearance.finishOptions[0].label)
        ),
        renderFinishOptions(spec.appearance.finishOptions)
    );

    const $glassField = $('<div class="customization-field"></div>').append(
        $('<div class="customization-field-head"></div>').append(
            $('<span class="customization-label"></span>').text(spec.appearance.glassLabel),
            $('<strong class="customization-selected" data-selected-glass></strong>').text(spec.appearance.glassOptions[0].label)
        ),
        renderGlassOptions(spec.appearance.glassOptions)
    );

    const $customNote = $('<p class="customization-footnote mb-0"></p>').text('Customization shown here is for quotation preference only. Final fabrication details are reviewed and approved during quotation, measurement, and contract confirmation.');
    $customPanel.append($finishField, $glassField, $customNote);

    const $specPanel = $(
        '<section class="product-specification-panel" aria-labelledby="specHeading"><div class="section-heading-block"><h3 id="specHeading">Specifications &amp; Availability</h3><p class="section-helper-copy">These are the usual configuration ranges for this product. Final specifications are confirmed during quotation and site measurement.</p></div><dl class="product-spec-grid"></dl><div class="availability-badge">Availability, final dimensions, glass or panel build, finish, and installation details are confirmed during quotation.</div></section>'
    );

    const groups = [
        ["Common size ranges", makeList(spec.sizes)],
        ["Glass / panel choices", makeList(spec.materials)],
        ["Finish choices", makeList(spec.finishes)]
    ];

    groups.forEach(([label, $content]) => {
        const $group = $('<div class="product-spec-group"></div>');
        $group.append($('<dt></dt>').text(label), $('<dd></dd>').append($content));
        $specPanel.find('dl').append($group);
    });

    const $production = $('<div class="product-spec-group"></div>').append(
        $('<dt></dt>').text('Production and quotation'),
        $('<dd></dd>').append(
            $('<p>', {
                class: 'product-spec-copy',
                text: 'Made to order. Final measurements and approved design details are confirmed after site inspection and before fabrication.'
            })
        )
    );
    $specPanel.find('dl').append($production);

    const $guidance = $('<section>', { class: 'product-guidance', 'aria-label': 'Product guidance' });
    $guidance.append(
        $('<article>', { class: 'product-guidance-card' }).append(
            $('<span>').text('Best for'),
            $('<p>').text(spec.bestFor)
        ),
        $('<article>', { class: 'product-guidance-card' }).append(
            $('<span>').text('Quotation notes'),
            $('<ul>').append(spec.notes.map((note) => $('<li>').text(note)))
        )
    );

    $(".add-product-quote").after($customPanel, $specPanel, $guidance);

    const options = (items) => items
        .map((item) => `<option value="${String(item).replace(/"/g, '&quot;')}">${item}</option>`)
        .join('');

    function estimatePrice() {
        if (!startingPrice) {
            return 0;
        }

        const selectedSize = $("#quoteSize").val() || spec.sizes[0];
        const selectedMaterial = String($("#quoteMaterial").val() || "").toLowerCase();
        const selectedFinish = String($("#quoteFinish").val() || "").toLowerCase();
        const quantity = Math.max(1, Number($("#quoteQuantity").val()) || 1);
        const sizeIndex = Math.max(0, spec.sizes.indexOf(selectedSize));
        const sizeFactors = [1, 1.08, 1.18, 1.28];
        const sizeFactor = /custom/i.test(selectedSize) ? 1.28 : (sizeFactors[sizeIndex] || 1);

        let materialFactor = 1;
        if (/12 mm|laminated|custom/.test(selectedMaterial)) materialFactor = 1.15;
        else if (/10 mm|tempered/.test(selectedMaterial)) materialFactor = 1.10;
        else if (/tinted|frosted/.test(selectedMaterial)) materialFactor = 1.06;

        let finishFactor = 1;
        if (/custom|wood|brushed|stainless/.test(selectedFinish)) finishFactor = 1.06;

        const estimate = startingPrice * sizeFactor * materialFactor * finishFactor * quantity;
        return Math.round(estimate / 500) * 500;
    }

    const modelPreviewSrc = modelPreviewFile ? `../../Assets/${modelPreviewFile}` : imageSrc;
    const modalHtml = `
        <div class="modal fade quote-modal quote-modal-simple" id="productQuoteModal" tabindex="-1" aria-labelledby="productQuoteModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header quote-modal-header">
                        <div class="quote-product-intro">
                            <div class="quote-product-model-preview">
                                <img src="${modelPreviewSrc}" alt="3D model preview of ${productName}">
                            </div>
                            <div>
                                <p class="small text-secondary mb-1">Add product to quote</p>
                                <h2 class="modal-title fs-4" id="productQuoteModalLabel"></h2>
                                <p class="quote-modal-starting-price mb-0">${startingPrice ? `Starts around ${CalixApp.formatCurrency(startingPrice)}*` : "Price upon quotation"}</p>
                            </div>
                        </div>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form id="productQuoteForm">
                        <div class="modal-body">
                            <p class="quote-simple-intro">Choose only the essentials now. CALIX can confirm the exact measurements and technical details with you later.</p>
                            <div class="row g-3">
                                <div class="col-md-8">
                                    <label class="form-label" for="quoteSize">Size</label>
                                    <select class="form-select" id="quoteSize" required>${options(spec.sizes)}</select>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label" for="quoteQuantity">Quantity</label>
                                    <input class="form-control" id="quoteQuantity" min="1" value="1" required type="number">
                                </div>
                                <div class="col-12 d-none" id="customDimensionFields">
                                    <div class="row g-3">
                                        <div class="col-6"><label class="form-label" for="quoteWidth">Width (mm)</label><input class="form-control" id="quoteWidth" min="1" inputmode="numeric" type="number" placeholder="Optional"></div>
                                        <div class="col-6"><label class="form-label" for="quoteHeight">Height (mm)</label><input class="form-control" id="quoteHeight" min="1" inputmode="numeric" type="number" placeholder="Optional"></div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label" for="quoteMaterial">Glass / panel</label>
                                    <select class="form-select" id="quoteMaterial" required>${options(spec.materials)}</select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label" for="quoteFinish">Finish</label>
                                    <select class="form-select" id="quoteFinish" required>${options(spec.finishes)}</select>
                                </div>
                            </div>
                            <details class="quote-optional-details mt-3">
                                <summary>Anything else CALIX should know? <span>Optional</span></summary>
                                <div class="pt-3">
                                    <label class="form-label" for="quoteNotes">Project note</label>
                                    <textarea class="form-control" id="quoteNotes" rows="3" placeholder="Opening direction, hardware preference, access concern, or special request"></textarea>
                                </div>
                            </details>
                            <div class="quote-estimate-panel mt-3">
                                <div>
                                    <span>Current planning estimate</span>
                                    <strong id="quoteEstimatedTotal">${startingPrice ? CalixApp.formatCurrency(startingPrice) : "Price upon quotation"}</strong>
                                </div>
                                <p class="mb-0">*Estimate only. Final price may vary per contract agreement, final measurements, selected materials, hardware, site conditions, and approved design.</p>
                            </div>
                        </div>
                        <div class="modal-footer quote-modal-footer">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-calix-action">Add on quote</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>`;

    $("body").append(modalHtml);
    $("#productQuoteModalLabel").text(productName);

    function updateGroupState($group, $button) {
        $group.find("button").removeClass("is-active").attr("aria-pressed", "false");
        $button.addClass("is-active").attr("aria-pressed", "true");
    }

    function updateCustomDimensions() {
        $("#customDimensionFields").toggleClass("d-none", !/custom/i.test($("#quoteSize").val() || ""));
    }

    function updateEstimate() {
        const amount = estimatePrice();
        $("#quoteEstimatedTotal").text(amount ? CalixApp.formatCurrency(amount) : "Price upon quotation");
    }

    $(document).on("click", "[data-model-finish]", function () {
        const $button = $(this);
        updateGroupState($button.closest('[data-appearance-group="finish"]'), $button);
        $("[data-selected-finish]").text($button.text().trim());
        $("#quoteFinish").val($button.data("optionValue"));
        updateEstimate();
    });

    $(document).on("click", "[data-model-glass]", function () {
        const $button = $(this);
        updateGroupState($button.closest('[data-appearance-group="glass"]'), $button);
        $("[data-selected-glass]").text($button.text().trim());
        $("#quoteMaterial").val($button.data("optionValue"));
        updateEstimate();
    });

    $("#quoteFinish").val(spec.appearance.finishOptions[0].value);
    $("#quoteMaterial").val(spec.appearance.glassOptions[0].value);

    $("#quoteSize, #quoteMaterial, #quoteFinish, #quoteQuantity").on("change input", function () {
        updateCustomDimensions();
        updateEstimate();
    });

    $(".add-product-quote").on("click", function (event) {
        event.preventDefault();
        updateCustomDimensions();
        updateEstimate();
        bootstrap.Modal.getOrCreateInstance(document.getElementById("productQuoteModal")).show();
    });

    $("#productQuoteForm").on("submit", function (event) {
        event.preventDefault();

        const width = $("#quoteWidth").val();
        const height = $("#quoteHeight").val();
        const quantity = Math.max(1, Number($("#quoteQuantity").val()) || 1);
        const estimatedTotal = estimatePrice();
        const estimatedUnitPrice = estimatedTotal ? Math.round(estimatedTotal / quantity) : 0;

        CalixApp.addQuoteItem({
            type: "Product",
            name: productName,
            category,
            imageFile,
            modelPreviewFile,
            referenceImageFile: catalogItem.referenceImageFile || imageFile,
            startingPrice,
            estimatedUnitPrice,
            estimatedTotal,
            quantity,
            specs: {
                size: $("#quoteSize").val(),
                customDimensions: width && height ? `${width} × ${height} mm` : "",
                material: $("#quoteMaterial").val(),
                finish: $("#quoteFinish").val(),
                notes: $("#quoteNotes").val().trim()
            }
        });

        bootstrap.Modal.getInstance(document.getElementById("productQuoteModal")).hide();
        CalixApp.showToast(`${productName} added to your quote list.`);
    });

});
