$(function () {
    "use strict";

    const $media = $("[data-product-media]").first();
    const viewer = $media.find("model-viewer")[0];
    const $referenceButton = $media.find("[data-reference-photo]");
    const $referenceModal = $("#referencePhotoModal");
    const $referenceImage = $referenceModal.find("[data-reference-image]");
    const productName = $(".product-info h2").first().text().trim();

    const productViews = {
        "Sliding Glass Door": {
            orientation: "0deg -90deg 0deg",
            defaultOrbit: "22deg 78deg 125%",
            frontOrbit: "0deg 88deg 122%",
            detailOrbit: "42deg 72deg 92%",
            fieldOfView: "28deg",
            detailFov: "22deg"
        },
        "Glass Window": {
            orientation: "0deg -90deg 0deg",
            defaultOrbit: "24deg 79deg 134%",
            frontOrbit: "0deg 88deg 132%",
            detailOrbit: "40deg 74deg 98%",
            fieldOfView: "26deg",
            detailFov: "21deg"
        },
        "Aluminum Door": {
            orientation: "0deg -90deg 0deg",
            defaultOrbit: "18deg 79deg 122%",
            frontOrbit: "0deg 89deg 118%",
            detailOrbit: "38deg 74deg 92%",
            fieldOfView: "26deg",
            detailFov: "22deg"
        },
        "Glass Stair Railing": {
            orientation: "0deg -90deg 0deg",
            defaultOrbit: "34deg 76deg 170%",
            frontOrbit: "90deg 82deg 176%",
            detailOrbit: "52deg 70deg 112%",
            fieldOfView: "24deg",
            detailFov: "18deg"
        },
        "Frameless Shower Enclosure": {
            orientation: "0deg -90deg 0deg",
            defaultOrbit: "24deg 78deg 145%",
            frontOrbit: "0deg 88deg 142%",
            detailOrbit: "42deg 72deg 108%",
            fieldOfView: "25deg",
            detailFov: "20deg"
        },
        "Frosted Sliding Door": {
            orientation: "0deg -90deg 0deg",
            defaultOrbit: "18deg 79deg 126%",
            frontOrbit: "0deg 88deg 122%",
            detailOrbit: "38deg 72deg 98%",
            fieldOfView: "27deg",
            detailFov: "22deg"
        },
        "Black Aluminum Sliding Door": {
            orientation: "0deg -90deg 0deg",
            defaultOrbit: "20deg 79deg 128%",
            frontOrbit: "0deg 88deg 126%",
            detailOrbit: "40deg 73deg 95%",
            fieldOfView: "27deg",
            detailFov: "22deg"
        },
        "Awning Window": {
            orientation: "0deg -90deg 0deg",
            defaultOrbit: "26deg 76deg 140%",
            frontOrbit: "0deg 87deg 136%",
            detailOrbit: "44deg 72deg 100%",
            fieldOfView: "25deg",
            detailFov: "20deg"
        },
        "Sliding Aluminum Window": {
            orientation: "0deg -90deg 0deg",
            defaultOrbit: "22deg 79deg 136%",
            frontOrbit: "0deg 88deg 132%",
            detailOrbit: "40deg 73deg 100%",
            fieldOfView: "26deg",
            detailFov: "21deg"
        }
    };

    const finishPresets = {
        black: { frame: [0.20, 0.22, 0.24, 1], metal: [0.18, 0.20, 0.21, 1], wood: [0.48, 0.31, 0.17, 1], accent: [0.18, 0.20, 0.21, 1] },
        matteblack: { frame: [0.14, 0.16, 0.17, 1], metal: [0.14, 0.16, 0.17, 1], wood: [0.48, 0.31, 0.17, 1], accent: [0.14, 0.16, 0.17, 1] },
        texturedblack: { frame: [0.24, 0.26, 0.28, 1], metal: [0.24, 0.26, 0.28, 1], wood: [0.48, 0.31, 0.17, 1], accent: [0.24, 0.26, 0.28, 1] },
        analok: { frame: [0.71, 0.74, 0.77, 1], metal: [0.78, 0.80, 0.82, 1], wood: [0.54, 0.38, 0.23, 1], accent: [0.74, 0.77, 0.79, 1] },
        white: { frame: [0.94, 0.95, 0.96, 1], metal: [0.86, 0.88, 0.90, 1], wood: [0.54, 0.38, 0.23, 1], accent: [0.94, 0.95, 0.96, 1] },
        wood: { frame: [0.56, 0.39, 0.23, 1], metal: [0.64, 0.46, 0.28, 1], wood: [0.56, 0.39, 0.23, 1], accent: [0.46, 0.31, 0.18, 1] },
        bronze: { frame: [0.48, 0.36, 0.28, 1], metal: [0.52, 0.40, 0.31, 1], wood: [0.56, 0.39, 0.23, 1], accent: [0.42, 0.31, 0.24, 1] },
        chrome: { frame: [0.82, 0.84, 0.86, 1], metal: [0.84, 0.86, 0.88, 1], wood: [0.56, 0.39, 0.23, 1], accent: [0.84, 0.86, 0.88, 1] },
        brushed: { frame: [0.75, 0.74, 0.71, 1], metal: [0.75, 0.74, 0.71, 1], wood: [0.56, 0.39, 0.23, 1], accent: [0.75, 0.74, 0.71, 1] },
        stainless: { frame: [0.73, 0.77, 0.80, 1], metal: [0.73, 0.77, 0.80, 1], wood: [0.56, 0.39, 0.23, 1], accent: [0.73, 0.77, 0.80, 1] }
    };

    const glassPresets = {
        clear: [0.85, 0.94, 0.98, 0.26],
        tinted: [0.46, 0.61, 0.67, 0.36],
        frosted: [0.97, 0.98, 0.99, 0.56],
        tempered: [0.82, 0.93, 0.97, 0.30],
        laminated: [0.82, 0.92, 0.96, 0.34],
        whiteglass: [0.97, 0.97, 0.97, 0.74]
    };

    const viewConfig = productViews[productName] || {
        orientation: "0deg -90deg 0deg",
        defaultOrbit: "22deg 78deg 128%",
        frontOrbit: "0deg 88deg 126%",
        detailOrbit: "40deg 72deg 96%",
        fieldOfView: "27deg",
        detailFov: "21deg"
    };

    let currentFinish = $("[data-model-finish].is-active").data("modelFinish") || "black";
    let currentGlass = $("[data-model-glass].is-active").data("modelGlass") || "clear";

    function applyViewerState(orbit, fov) {
        if (!viewer) {
            return;
        }
        viewer.cameraOrbit = orbit;
        viewer.fieldOfView = fov;
        if (typeof viewer.jumpCameraToGoal === "function") {
            viewer.jumpCameraToGoal();
        }
    }

    function classifyMaterial(materialName) {
        const name = String(materialName || "").toLowerCase();
        if (name.includes("glass") || name.includes("pane") || name.includes("frost")) {
            return "glass";
        }
        if (name.includes("wood")) {
            return "wood";
        }
        if (
            name.includes("stainless") ||
            name.includes("chrome") ||
            name.includes("hardware") ||
            name.includes("hinge") ||
            name.includes("handle") ||
            name.includes("clamp") ||
            name.includes("support") ||
            name.includes("operator") ||
            name.includes("roller") ||
            name.includes("post") ||
            name.includes("rail") ||
            name.includes("lock")
        ) {
            return "metal";
        }
        if (name.includes("mesh") || name.includes("gasket") || name.includes("brush")) {
            return "accent";
        }
        return "frame";
    }

    function setMaterialColor(material, rgba) {
        if (!material || !material.pbrMetallicRoughness || typeof material.pbrMetallicRoughness.setBaseColorFactor !== "function") {
            return;
        }
        material.pbrMetallicRoughness.setBaseColorFactor(rgba);
    }

    function applyAppearance() {
        if (!viewer || !viewer.model || !Array.isArray(viewer.model.materials)) {
            return;
        }

        const finish = finishPresets[currentFinish] || finishPresets.black;
        const glass = glassPresets[currentGlass] || glassPresets.clear;

        viewer.model.materials.forEach((material) => {
            const kind = classifyMaterial(material.name);

            if (kind === "glass") {
                setMaterialColor(material, glass);
                return;
            }

            if (kind === "wood") {
                setMaterialColor(material, currentFinish === "wood" ? finish.wood : [0.54, 0.37, 0.22, 1]);
                return;
            }

            if (kind === "metal") {
                setMaterialColor(material, finish.metal || finish.frame);
                return;
            }

            if (kind === "accent") {
                setMaterialColor(material, finish.accent || [0.14, 0.16, 0.17, 1]);
                return;
            }

            setMaterialColor(material, finish.frame);
        });
    }

    if (viewer) {
        viewer.setAttribute("orientation", viewConfig.orientation);
        viewer.setAttribute("camera-orbit", viewConfig.defaultOrbit);
        viewer.setAttribute("field-of-view", viewConfig.fieldOfView);
        viewer.setAttribute("min-camera-orbit", "auto 55deg auto");
        viewer.setAttribute("max-camera-orbit", "auto 100deg auto");
        viewer.setAttribute("min-field-of-view", "14deg");
        viewer.setAttribute("max-field-of-view", "34deg");

        viewer.addEventListener("load", function () {
            if (typeof viewer.updateFraming === "function") {
                viewer.updateFraming();
            }
            applyViewerState(viewConfig.defaultOrbit, viewConfig.fieldOfView);
            applyAppearance();
        });

        $media.find("[data-model-reset]").on("click", function () {
            applyViewerState(viewConfig.defaultOrbit, viewConfig.fieldOfView);
            if (typeof viewer.resetTurntableRotation === "function") {
                viewer.resetTurntableRotation();
            }
            applyAppearance();
        });

        const presetBar = $(
            '<div class="product-view-presets" role="group" aria-label="Model view presets">' +
                '<button type="button" class="view-preset-button is-active" data-view-preset="default">Perspective</button>' +
                '<button type="button" class="view-preset-button" data-view-preset="front">Front</button>' +
                '<button type="button" class="view-preset-button" data-view-preset="detail">Detail</button>' +
            '</div>'
        );
        $media.find('.product-model-stage').before(presetBar);

        presetBar.on("click", "[data-view-preset]", function () {
            const $button = $(this);
            presetBar.find("button").removeClass("is-active").attr("aria-pressed", "false");
            $button.addClass("is-active").attr("aria-pressed", "true");

            const key = $button.data("viewPreset");
            if (key === "front") {
                applyViewerState(viewConfig.frontOrbit, viewConfig.fieldOfView);
                return;
            }
            if (key === "detail") {
                applyViewerState(viewConfig.detailOrbit, viewConfig.detailFov || viewConfig.fieldOfView);
                return;
            }
            applyViewerState(viewConfig.defaultOrbit, viewConfig.fieldOfView);
        });
    }

    $(document).on("click", "[data-model-finish]", function () {
        currentFinish = $(this).data("modelFinish") || currentFinish;
        applyAppearance();
    });

    $(document).on("click", "[data-model-glass]", function () {
        currentGlass = $(this).data("modelGlass") || currentGlass;
        applyAppearance();
    });

    $referenceButton.on("click", function () {
        const source = $(this).data("referenceSrc") || $media.data("referenceSrc");

        if (source) {
            $referenceImage.attr("src", source);
        }

        if ($referenceModal.length) {
            bootstrap.Modal.getOrCreateInstance($referenceModal[0]).show();
        }
    });
});
