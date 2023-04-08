export class MultilineInputUtil {
static getValues = () => {
  const spans = document.querySelectorAll(
    "div.features > span.tag.pill-input.tag-gray"
  );
  const values = []
  for (const span of spans) {
    const value = span.querySelector("input").value;
    values.push(value);
   }
   return values;
};
static addFeature = () => {
  const $features = $(".features");
  const pillInput = $(
    '<span class="tag pill-input"><input type="text" size="1"/><i class="delete">&times;</i></span>'
  );
  $features.append(pillInput);
  this.initFeatures();
  $(".pill-input").last().find("input").focus();
};

static removeFeatures = () => $(".pill-input").remove();

static initFeatures = () => {
  const $parent = $(".pill-input");
  const $input = $(".pill-input > input");
  const $closeButton = $(".delete");

  $closeButton.click(function () {
    $(this).parent().remove();
  });

  $parent.click(function () {
    $(this).find("input").focus();
  });

  $input.focus(function () {
    $(this).parent().addClass("focus");
  });

  $input.blur(function () {
    const input = $(this);
    if (input.length) {
      input.parent().addClass("tag-gray");
    }
    input.parent().removeClass("focus");
  });

  const e = "keyup,keypress,focus,blur,change".split(",");

  for (let i in e) {
    $input.on(e[i], function () {
      const $this = $(this);
      if ($this.val().length == 0) {
        $this.attr("size", 1);
      } else {
        $this.attr("size", $this.val().length);
      }
    });
  }
}

}

